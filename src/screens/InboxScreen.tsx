import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { loadThoughts, removeThought } from '../utils/storage';

type Thought = {
  id: number;
  content: string;
  createdAt: string;
  tag: string;
};

const TAGS = ['all', 'idea', 'task', 'worry', 'note', 'random'];

export default function InboxScreen() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [selectedTag, setSelectedTag] = useState('all');

  const fetchThoughts = async () => {
    const saved = await loadThoughts();
    setThoughts(saved);
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleDelete = async (id: number) => {
    await removeThought(id);
    fetchThoughts();
  };

  const confirmDelete = (id: number) => {
    Alert.alert('Delete Thought', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  };

  const handleExport = async () => {
    if (thoughts.length === 0) return;

    const textDump = thoughts
      .map(
        (t) =>
          `[${
            t.tag.toUpperCase()
          }] ${new Date(t.createdAt).toLocaleString()}\n${t.content}\n`
      )
      .join('\n');

    await Clipboard.setStringAsync(textDump);
    Alert.alert('Copied!', 'Thoughts exported to clipboard.');
  };

  const filteredThoughts =
    selectedTag === 'all'
      ? thoughts
      : thoughts.filter((t) => t.tag === selectedTag);

  const renderItem = ({ item }: { item: Thought }) => (
    <View style={styles.thoughtCard}>
      <Text style={styles.tagLabel}>{item.tag.toUpperCase()}</Text>
      <Text style={styles.thoughtText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      {/* Export + Filter Section */}
      <View>
        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Text style={styles.exportText}>Export to Clipboard</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagFilterContainer}
        >
          {TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagButton, isSelected && styles.tagSelected]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text
                  style={[styles.tagText, isSelected && styles.tagTextSelected]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Thought List */}
      <FlatList
        data={filteredThoughts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No thoughts for this tag.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  exportButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#4e91fc',
    borderRadius: 8,
    alignSelf: 'center',
  },
  exportText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tagFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    height: 48, // Fixes layout jump
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70, // Forces consistent button size
  },
  tagSelected: {
    backgroundColor: '#4e91fc',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#fff',
  },
  thoughtCard: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  thoughtText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
