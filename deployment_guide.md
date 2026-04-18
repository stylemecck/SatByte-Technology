# SatByte Deployment & Build Guide

Follow these steps to build your production-ready app and sync it to your physical device.

## 1. Environment Check
Ensure your `.env.production` file points to your live server:
```env
VITE_API_URL=https://satbyte-technology.onrender.com/api
```

## 2. Web Build
Build the optimized frontend bundle:
```bash
npm run build
```
This generates the `dist/` folder which Capacitor uses.

## 3. Capacitor Sync
Synchronize the new web build into your native Android project:
```bash
npx cap sync
```

## 4. App Icons (Optional but Recommended)
If you haven't yet integrated the new branding icons into the binary folders:
1. Open **Android Studio**.
2. Right-click on the `app` folder -> **New** -> **Image Asset**.
3. Select **Path** and browse to `public/app-icon.png`.
4. Adjust scaling and click **Finish**. This will generate all the required sizes for Google Play.

## 5. Live Testing
To test connectivity on a real device:
1. Connect your phone via USB.
2. In Android Studio, click **Run**.
3. Check the **Logcat** tab and look for:
   `[SatByte API] Initialized | Mode: Production | Base: https://satbyte-technology.onrender.com/api/`

---

> [!TIP]
> **CORS Check**: If you see 'CORS Errors' in the logs, ensure your Render backend has the latest `server/index.js` code deployed, as it contains the updated mobile origin policies.
