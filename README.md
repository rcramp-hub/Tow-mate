# Tow Mate

A pilot-style pre-departure safety checklist for towing. Flip each tab to confirm a
check is secure; the app only clears to **READY TO TOW** once every item is set. Works
offline, installs to the home screen, and keeps a separate checklist for each rig.

Built as a single self-contained page — no build step, no dependencies, no server code.

## Files in this repository

| File | Purpose |
|------|---------|
| `index.html` | The entire app (HTML, CSS, and JavaScript in one file). |
| `sw.js` | Service worker — network-first caching so the app works offline. |
| `manifest.json` | PWA metadata (name, colours, icons) for home-screen install. |
| `icon.svg` | Vector app icon (source). |
| `icon-192.png` / `icon-512.png` | Raster icons for Android / install prompts. |
| `apple-touch-icon.png` | Home-screen icon for iOS (180×180). |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (no Jekyll processing). |

All paths are relative, so the app runs correctly from a project page
(`https://<you>.github.io/<repo>/`) without any configuration.

## Deploy to GitHub Pages

### Option A — GitHub website (no command line)

1. Create a new repository (e.g. `tow-mate`).
2. On the repo page choose **Add file → Upload files**, drag in every file listed
   above, and commit to the `main` branch.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**,
   pick branch **main** and folder **/ (root)**, then **Save**.
5. Wait ~1 minute. Your app is live at `https://<you>.github.io/<repo>/`.

### Option B — Git command line

```bash
git init
git add .
git commit -m "Tow Mate initial release"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then enable Pages as in steps 3–5 above.

## Install it on a phone

Open the live URL on the phone, then:

- **iPhone (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** menu → **Install app** (or the install prompt).

It then launches full-screen like a native app and runs offline.

## Updating the app later

The service worker serves cached files when a device is offline, so after you push a
change, **bump the cache version** so every device pulls the new files:

```js
// sw.js — top line
const CACHE = 'towmate-v1.0.1';   // increment on each release
```

Changing that string retires the old cache on next launch. (Because the fetch handler
is network-first, online users get fresh files immediately; the version bump mainly
clears stale offline copies.)

## Notes

- Service workers require **HTTPS**. GitHub Pages provides this automatically.
- To test locally, serve over HTTP rather than opening the file directly
  (service workers don't run on `file://`):
  ```bash
  python3 -m http.server 8080
  # then visit http://localhost:8080
  ```
- The default 8-point checklist and its confirmation prompts live in the
  `DEFAULT_ITEMS` array near the top of the script block in `index.html`. Users can
  also edit, reorder, add, or remove checks per rig from within the app.
- To change the icon, edit `icon.svg` and re-export the three PNGs at 192, 512, and
  180 px.
