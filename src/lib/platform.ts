import { Capacitor } from '@capacitor/core'

/**
 * Utility to check if we are running in a native mobile environment (Android/iOS).
 * This allows us to toggle between the high-end App UI and the standard Web UI.
 */
export const isNativeApp = () => {
  return Capacitor.isNativePlatform()
}
