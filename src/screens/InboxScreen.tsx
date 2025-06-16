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

      <ScrollView horizontal contentContainerStyle={styles.tagFilterContainer}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagButton,
              selectedTag === tag && styles.tagSelected,
            ]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTag === tag && styles.tagTextSelected,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredThoughts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    marginBottom: 20,
    textAlign: 'center',
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
  tagFilterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  tagSelected: {
    backgroundColor: '#4e91fc',
  },
  tagText: {
    color: '#333',
    textTransform: 'capitalize',
  },
  tagTextSelected: {
    color: '#fff',
  },
});
