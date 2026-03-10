/* global process, Buffer */
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOP_TRACKS_LIMIT = 5;
const TOP_TRACKS_RANGE = 'medium_term';

function getSpotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const missingVars = [
    !clientId && 'SPOTIFY_CLIENT_ID',
    !clientSecret && 'SPOTIFY_CLIENT_SECRET',
    !refreshToken && 'SPOTIFY_REFRESH_TOKEN',
  ].filter(Boolean);

  if (missingVars.length > 0) {
    throw new Error(`Missing Spotify environment variables: ${missingVars.join(', ')}`);
  }

  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken() {
  const { clientId, clientSecret, refreshToken } = getSpotifyConfig();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    const errorMessage = data.error_description || data.error || 'Unable to refresh Spotify access token.';
    throw new Error(errorMessage);
  }

  return data.access_token;
}

async function fetchSpotify(endpoint, accessToken) {
  return fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function mapTrack(track) {
  return {
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const accessToken = await getAccessToken();

    const [nowPlayingResponse, topTracksResponse] = await Promise.all([
      fetchSpotify(NOW_PLAYING_ENDPOINT, accessToken),
      fetchSpotify(
        `${TOP_TRACKS_ENDPOINT}?limit=${TOP_TRACKS_LIMIT}&time_range=${TOP_TRACKS_RANGE}`,
        accessToken
      ),
    ]);

    let nowPlaying = null;
    if (nowPlayingResponse.status === 200) {
      const nowPlayingData = await nowPlayingResponse.json();
      if (nowPlayingData?.item) {
        nowPlaying = {
          isPlaying: nowPlayingData.is_playing,
          ...mapTrack(nowPlayingData.item),
        };
      }
    } else if (nowPlayingResponse.status !== 204) {
      const errorBody = await nowPlayingResponse.text();
      throw new Error(`Spotify now playing request failed (${nowPlayingResponse.status}): ${errorBody}`);
    }

    if (!topTracksResponse.ok) {
      const errorBody = await topTracksResponse.text();
      throw new Error(`Spotify top tracks request failed (${topTracksResponse.status}): ${errorBody}`);
    }

    const topTracksData = await topTracksResponse.json();
    const tracks = (topTracksData.items || []).map(mapTrack);

    return res.status(200).json({
      nowPlaying,
      tracks,
      tracksRangeLabel: 'Last 6 Months',
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to load Spotify data.',
      nowPlaying: null,
      tracks: [],
      tracksRangeLabel: 'Last 6 Months',
    });
  }
}
