import AsyncStorage from '@react-native-async-storage/async-storage'

// Storage keys
const KEPT_MEDIA_KEY = '@CameraRollApp:keptMedia'
const DELETED_MEDIA_KEY = '@CameraRollApp:deletedMedia'

// Media tracking type
export interface MediaRecord {
  id: string
  uri: string
  mediaType: string
  timestamp: number
}

export const StorageService = {
  // Add media to kept list
  addKeptMedia: async (media: Omit<MediaRecord, 'timestamp'>): Promise<void> => {
    try {
      const existing = await StorageService.getKeptMedia()
      const mediaWithTimestamp: MediaRecord = {
        ...media,
        timestamp: Date.now()
      }
      
      // Add to beginning of array to keep most recent first
      const updated = [mediaWithTimestamp, ...existing]
      await AsyncStorage.setItem(KEPT_MEDIA_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving kept media:', error)
    }
  },

  // Add media to deleted list
  addDeletedMedia: async (media: Omit<MediaRecord, 'timestamp'>): Promise<void> => {
    try {
      const existing = await StorageService.getDeletedMedia()
      const mediaWithTimestamp: MediaRecord = {
        ...media,
        timestamp: Date.now()
      }
      
      // Add to beginning of array to keep most recent first
      const updated = [mediaWithTimestamp, ...existing]
      await AsyncStorage.setItem(DELETED_MEDIA_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving deleted media:', error)
    }
  },

  // Get all kept media
  getKeptMedia: async (): Promise<MediaRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(KEPT_MEDIA_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error fetching kept media:', error)
      return []
    }
  },

  // Get all deleted media
  getDeletedMedia: async (): Promise<MediaRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(DELETED_MEDIA_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error fetching deleted media:', error)
      return []
    }
  },

  // Check if media is in kept list
  isMediaKept: async (mediaId: string): Promise<boolean> => {
    try {
      const kept = await StorageService.getKeptMedia()
      return kept.some(item => item.id === mediaId)
    } catch (error) {
      console.error('Error checking kept status:', error)
      return false
    }
  },

  // Check if media is in deleted list
  isMediaDeleted: async (mediaId: string): Promise<boolean> => {
    try {
      const deleted = await StorageService.getDeletedMedia()
      return deleted.some(item => item.id === mediaId)
    } catch (error) {
      console.error('Error checking deleted status:', error)
      return false
    }
  },

  // Remove a single media item from kept list
  removeFromKept: async (mediaId: string): Promise<void> => {
    try {
      const kept = await StorageService.getKeptMedia()
      const updated = kept.filter(item => item.id !== mediaId)
      await AsyncStorage.setItem(KEPT_MEDIA_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error removing from kept list:', error)
    }
  },

  // Remove a single media item from deleted list
  removeFromDeleted: async (mediaId: string): Promise<void> => {
    try {
      const deleted = await StorageService.getDeletedMedia()
      const updated = deleted.filter(item => item.id !== mediaId)
      await AsyncStorage.setItem(DELETED_MEDIA_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error removing from deleted list:', error)
    }
  },

  // Clear all kept media
  clearKeptMedia: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(KEPT_MEDIA_KEY)
    } catch (error) {
      console.error('Error clearing kept media:', error)
    }
  },

  // Clear all deleted media
  clearDeletedMedia: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(DELETED_MEDIA_KEY)
    } catch (error) {
      console.error('Error clearing deleted media:', error)
    }
  }
} 