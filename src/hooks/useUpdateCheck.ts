import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { api } from '@/lib/apiClient';

export function useUpdateCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // 1. Get current app information
        const info = await App.getInfo();
        const currentVersion = info.version; // e.g., "1.0.0"

        // 2. Fetch latest version from your server
        // You should create an endpoint /api/version that returns { version: "1.0.1" }
        const { data } = await api.get<{ version: string }>('version');

        if (data.version !== currentVersion) {
          setLatestVersion(data.version);
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error('[UpdateCheck] Failed to check for updates:', error);
      }
    };

    checkVersion();
  }, []);

  return { updateAvailable, latestVersion };
}
