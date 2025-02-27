import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { StorageService, MediaRecord } from '../../services/StorageService'

type HistoryTab = 'kept' | 'deleted'

export default function MediaHistory() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('kept')
  const [media, setMedia] = useState<MediaRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const data = activeTab === 'kept'
        ? await StorageService.getKeptMedia()
        : await StorageService.getDeletedMedia()
      setMedia(data)
    } catch (error) {
      console.error(`Error loading ${activeTab} media:`, error)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  // Load media when tab changes
  useEffect(() => {
    loadMedia()
  }, [activeTab, loadMedia])

  const handleTabPress = (tab: HistoryTab) => {
    setActiveTab(tab)
  }

  const handleClearHistory = async () => {
    try {
      if (activeTab === 'kept') {
        await StorageService.clearKeptMedia()
      } else {
        await StorageService.clearDeletedMedia()
      }
      loadMedia()
    } catch (error) {
      console.error(`Error clearing ${activeTab} media:`, error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const renderItem = ({ item }: { item: MediaRecord }) => (
    <View style={styles.mediaItem}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaId} numberOfLines={1}>ID: {item.id}</Text>
        <Text style={styles.mediaDate}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Media History</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'kept' && styles.activeTab]}
          onPress={() => handleTabPress('kept')}
        >
          <Text style={[styles.tabText, activeTab === 'kept' && styles.activeTabText]}>
            Kept
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'deleted' && styles.activeTab]}
          onPress={() => handleTabPress('deleted')}
        >
          <Text style={[styles.tabText, activeTab === 'deleted' && styles.activeTabText]}>
            Deleted
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : media.length > 0 ? (
          <FlatList
            data={media}
            keyExtractor={(item) => `${activeTab}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>
            No {activeTab} media found
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearHistory}
      >
        <Text style={styles.clearButtonText}>
          Clear {activeTab === 'kept' ? 'Kept' : 'Deleted'} History
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    paddingBottom: 16,
  },
  mediaItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  mediaInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  mediaId: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  mediaDate: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  clearButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}) 