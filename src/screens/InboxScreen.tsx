import React, { useEffect, useState, useLayoutEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { loadThoughts, removeThought } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

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

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { current, themeColors, fontScale } = useTheme();
  const isDark = current === 'dark';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: themeColors.background,
      },
      headerTitleStyle: {
        color: themeColors.text,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Ionicons name="settings-outline" size={24} color={themeColors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, themeColors]);

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
          `[${t.tag.toUpperCase()}] ${new Date(t.createdAt).toLocaleString()}
${t.content}\n`
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
    <View style={[styles.thoughtCard, { backgroundColor: themeColors.card }]}>
      <Text style={[styles.tagLabel, { color: themeColors.text, fontSize: 12 * fontScale }]}>{item.tag.toUpperCase()}</Text>
      <Text style={[styles.thoughtText, { color: themeColors.text, fontSize: 16 * fontScale }]}>{item.content}</Text>
      <Text style={[styles.timestamp, { color: themeColors.text, fontSize: 12 * fontScale }]}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={[styles.deleteText, { fontSize: 14 * fontScale }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text, fontSize: 26 * fontScale }]}>Inbox</Text>

      <View>
        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Text style={[styles.exportText, { fontSize: 14 * fontScale }]}>Export to Clipboard</Text>
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
                style={[styles.tagButton, { backgroundColor: isSelected ? themeColors.highlight : themeColors.tag }]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text
                  style={{
                    color: isSelected ? '#fff' : themeColors.tagText,
                    fontSize: 14 * fontScale,
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredThoughts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: themeColors.text, fontSize: 16 * fontScale }]}>No thoughts for this tag.</Text>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    height: 48,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  thoughtCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  thoughtText: {
    marginBottom: 4,
  },
  timestamp: {
    marginBottom: 6,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tagLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
});
