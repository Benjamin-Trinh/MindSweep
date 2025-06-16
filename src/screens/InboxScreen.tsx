import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { loadThoughts, removeThought } from '../utils/storage';

type Thought = {
  id: number;
  content: string;
  createdAt: string;
};

export default function InboxScreen() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const fetchThoughts = async () => {
    const saved = await loadThoughts();
    setThoughts(saved);
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleDelete = async (id: number) => {
    await removeThought(id);
    fetchThoughts(); // Refresh the list
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      'Delete Thought',
      'Are you sure you want to delete this thought?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Thought }) => (
    <View style={styles.thoughtCard}>
      <Text style={styles.thoughtText}>{item.content}</Text>
      <Text style ={styles.timestamp}>
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
      <FlatList
        data={thoughts}
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
    position: 'relative',
  },
  thoughtText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
