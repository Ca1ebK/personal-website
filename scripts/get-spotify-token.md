# How to Get Your Spotify Refresh Token

## Step 1: Get Your App Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your app (or create one if you haven't)
3. Note your **Client ID** and **Client Secret**
4. Click "Edit Settings" and add this Redirect URI: `http://localhost:3000/callback`
5. Save

## Step 2: Authorize Your App

Open this URL in your browser (replace `YOUR_CLIENT_ID`):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing%20user-read-playback-state
```

You'll be redirected to a URL like:
```
http://localhost:3000/callback?code=AUTHORIZATION_CODE_HERE
```

Copy the `code` value from the URL (everything after `?code=`).

## Step 3: Exchange Code for Refresh Token

Run this in your terminal (replace the placeholders):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "redirect_uri=http://localhost:3000/callback"
```

Or use this Node.js script:

```javascript
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const code = 'YOUR_AUTHORIZATION_CODE';

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://localhost:3000/callback',
  }),
})
.then(res => res.json())
.then(data => {
  console.log('Refresh Token:', data.refresh_token);
  console.log('Access Token:', data.access_token);
});
```

Save the file as `get-token.mjs` and run: `node get-token.mjs`

## Step 4: Add Environment Variables to Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com)
2. Go to Settings → Environment Variables
3. Add these three variables:

| Name | Value |
|------|-------|
| `SPOTIFY_CLIENT_ID` | Your Client ID |
| `SPOTIFY_CLIENT_SECRET` | Your Client Secret |
| `SPOTIFY_REFRESH_TOKEN` | The refresh token from Step 3 |

4. Redeploy your site

## Done!

Your Now Playing widget should now work. It will show:
- The current track if you're playing something
- "Not playing" if Spotify is paused

The widget updates every 30 seconds automatically.
