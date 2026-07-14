# Android TWA Packaging

Bridge can be packaged as an Android APK with Trusted Web Activity (TWA).

The APK should stay a lightweight Android shell around the Vercel-hosted web app:

- Android app start URL: `https://ohmymsbg.vercel.app`
- Recommended Android app name: `명심보감 Bridge`
- Recommended package name: `com.seojung.ohmymsbg.bridge`
- The dataset and UI continue to come from Vercel.
- Dataset/UI updates should flow through GitHub push -> Vercel deploy.
- Children should not need to reinstall the APK for normal web app or dataset updates.

## Why TWA

TWA opens the deployed PWA in a trusted fullscreen Android container. This avoids browser address bars and tabs while keeping the web app as the source of truth.

This fits Bridge because the app is still changing and the dataset will continue to expand. Native APK rebuilds should be reserved for Android shell changes.

## When APK Rebuild Is Required

Rebuild the APK when changing:

- Android package name
- Android signing key
- Android app icon or splash assets
- TWA start URL or allowed origins
- Native Android capabilities
- Bubblewrap or Gradle project configuration

Do not rebuild only for:

- Dataset changes
- Study UI changes
- Access gate copy or styling
- Web manifest metadata that Vercel can serve directly, unless Android shell metadata must also change

## Required Web Files

Current web app readiness:

- Manifest: `public/manifest.webmanifest`
- App name: `명심보감 Bridge`
- Short name: `명심보감`
- Start URL: `/`
- Scope: `/`
- Display mode: `standalone`
- Theme/background color: `#000000`
- Icons:
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `public/icons/icon.svg`
  - `public/icons/apple-touch-icon.png`

The current PNG icons satisfy the required dimensions. They are acceptable placeholders for packaging tests, but final production icon art should be reviewed separately.

## Digital Asset Links

TWA requires this file after deployment:

```text
https://ohmymsbg.vercel.app/.well-known/assetlinks.json
```

The current file is:

```text
public/.well-known/assetlinks.json
```

It contains the Android package name and current SHA-256 signing certificate fingerprint. If the Android signing key changes later, update this file with the new SHA-256 fingerprint before expecting TWA verification to pass.

## Get SHA-256 Signing Fingerprint

For a local keystore:

```bash
keytool -list -v -keystore path/to/release.keystore -alias your_alias
```

Look for `SHA256`.

For Google Play App Signing, use the SHA-256 certificate fingerprint shown in Play Console for the app signing certificate. For sideloaded test APKs, use the certificate that signs the APK installed on the device.

## Verify Asset Links After Deploy

After updating the real fingerprint and deploying to Vercel:

```bash
curl https://ohmymsbg.vercel.app/.well-known/assetlinks.json
```

Confirm:

- JSON is reachable over HTTPS
- `package_name` is `com.seojung.ohmymsbg.bridge`
- `sha256_cert_fingerprints` contains the real SHA-256 fingerprint
- There is no placeholder fingerprint left

## Child Phone TWA Checks

If the APK opens with a Chrome address bar, Android is likely falling back to a Custom Tab because TWA verification did not pass on that device.

Check the child phone in this order:

1. Update Chrome from Google Play.
2. Update Android System WebView if it is available on the device.
3. Open `https://ohmymsbg.vercel.app/.well-known/assetlinks.json` on the child phone and confirm it shows the deployed JSON.
4. Confirm the JSON contains package name `com.seojung.ohmymsbg.bridge`.
5. Confirm the JSON contains SHA-256 fingerprint `03:6E:5A:0F:E3:76:0C:C2:C3:AE:5A:CE:5A:B3:7F:73:BA:C2:87:87:58:82:43:67:4C:38:A0:E9:CC:8C:E1:9B`.
6. Clear Chrome cache and site storage for `ohmymsbg.vercel.app`.
7. Uninstall any old Bridge APK from the child phone.
8. Reinstall the latest signed APK.
9. Confirm the installed APK was built with application ID `com.seojung.ohmymsbg.bridge`.
10. Confirm the installed APK is signed by the certificate matching the SHA-256 fingerprint above.

Family Link or managed child devices may lag behind on Chrome updates or block some browser settings. If the same APK opens fullscreen on one phone but shows an address bar on the child phone, compare Chrome version, WebView version, cache state, and whether an older APK is still installed.

## Bubblewrap Packaging Flow

Suggested next steps:

1. Generate or configure the Android signing key.
2. Get the SHA-256 certificate fingerprint.
3. Put the SHA-256 fingerprint into `public/.well-known/assetlinks.json`.
4. Deploy to Vercel.
5. Verify `https://ohmymsbg.vercel.app/.well-known/assetlinks.json`.
6. Install Bubblewrap tooling.
7. Generate the TWA project from the deployed manifest.
8. Build a signed APK.
9. Install the APK on a test Android phone.
10. Verify it opens fullscreen without browser UI.
11. Test Family Link behavior on the child phone.

Typical Bubblewrap commands:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://ohmymsbg.vercel.app/manifest.webmanifest
bubblewrap build
```

During `bubblewrap init`, use:

- Application ID: `com.seojung.ohmymsbg.bridge`
- Start URL: `https://ohmymsbg.vercel.app/`
- Display mode: from manifest
- Signing key: the release key selected for this APK

## Cache Safety

Bridge should not add aggressive offline app-shell caching during active dataset expansion.

Current behavior:

- `public/sw.js` intentionally does not intercept fetch requests.
- The client registrar unregisters old service workers and clears stale caches.
- Key app routes use conservative no-store headers.
- `manifest.webmanifest` and `assetlinks.json` use no-cache headers.

This keeps Vercel deployments visible and reduces the risk that children see stale dataset or UI after a deploy.

If offline support is added later, it should be versioned carefully around a dataset version and should avoid trapping HTML/JS/data behind old caches.

## Current Limitation

The project is prepared for TWA packaging, but TWA verification still depends on the built APK being signed with the certificate whose SHA-256 fingerprint is listed in `public/.well-known/assetlinks.json`.
