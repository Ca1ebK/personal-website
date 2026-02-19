const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';

async function getAccessToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  console.log('ENV check - client_id exists:', !!client_id, 'client_secret exists:', !!client_secret, 'refresh_token exists:', !!refresh_token);
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();
  console.log('Token response status:', response.status, 'has access_token:', !!data.access_token);
  if (!data.access_token) console.error('Token error:', JSON.stringify(data));
  return data;
}

async function getTopTracks() {
  const { access_token } = await getAccessToken();

  return fetch(`${TOP_TRACKS_ENDPOINT}?limit=5&time_range=short_term`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await getTopTracks();

    if (response.status !== 200) {
      const errorBody = await response.text();
      console.error('Spotify API non-200:', response.status, errorBody);
      return res.status(200).json({ tracks: [], debug: { status: response.status, body: errorBody } });
    }

    const data = await response.json();

    const tracks = (data.items || []).map((track) => ({
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
    }));

    return res.status(200).json({ tracks });
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(200).json({ tracks: [] });
  }
}
