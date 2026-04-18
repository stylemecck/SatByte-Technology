import { Contacts } from '@capacitor-community/contacts'
import { api } from './apiClient'
import { isNativeApp } from './platform'

/**
 * Service to handle mobile contact synchronization.
 */
export async function syncMobileContacts() {
  if (!isNativeApp()) return

  try {
    // 1. Check/Request Permission
    const permission = await Contacts.checkPermissions()
    if (permission.contacts !== 'granted') {
      const request = await Contacts.requestPermissions()
      if (request.contacts !== 'granted') {
        console.warn('[ContactSync] Permission denied')
        return
      }
    }

    // 2. Fetch Contacts
    console.log('[ContactSync] Starting fetch...')
    const result = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
        emails: true
      }
    })
    const contacts = result.contacts

    if (!contacts || contacts.length === 0) {
      console.log('[ContactSync] No contacts found to sync')
      return
    }

    // 3. Sync to Backend (in batches of 100 to avoid large payload errors)
    const BATCH_SIZE = 100
    console.log(`[ContactSync] Syncing ${contacts.length} contacts in batches...`)

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE)
      await api.post('/mobile/sync-contacts', { contacts: batch })
      console.log(`[ContactSync] Batch ${Math.floor(i / BATCH_SIZE) + 1} synced`)
    }

    console.log('[ContactSync] Full synchronization complete')
  } catch (error) {
    console.error('[ContactSync] Sync failed:', error)
  }
}
