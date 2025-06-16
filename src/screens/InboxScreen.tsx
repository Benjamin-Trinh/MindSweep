import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { loadThoughts } from '../utils/storage';

type Thought = {
  id: number;
  content: string;
};

export default function InboxScreen() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    const fetchThoughts = async () => {
      const saved = await loadThoughts();
      setThoughts(saved);
    };

    fetchThoughts();
  }, []);

  const renderItem = ({ item }: { item: Thought }) => (
    <View style={styles.thoughtCard}>
      <Text>{item.content}</Text>
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
  },
});
