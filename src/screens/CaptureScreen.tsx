import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveThought } from '../utils/storage';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';

const TAGS = ['idea', 'task', 'worry', 'note', 'random'];

type CaptureScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Capture'
>;

export default function CaptureScreen() {
  const [thought, setThought] = useState('');
  const [selectedTag, setSelectedTag] = useState('idea');
  const navigation = useNavigation<CaptureScreenNavigationProp>();
  const { themeColors } = useTheme();

  const handleSave = async () => {
    if (!thought.trim()) return;
    await saveThought(thought, selectedTag);
    setThought('');
    setSelectedTag('idea');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>MindSweep</Text>

      <TextInput
        style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="What's on your mind?"
        placeholderTextColor={themeColors.placeholder}
        value={thought}
        onChangeText={setThought}
        multiline
      />

      <Text style={[styles.subheading, { color: themeColors.text }]}>Select Tag:</Text>
      <View style={styles.tagContainer}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagButton,
              { backgroundColor: selectedTag === tag ? '#4e91fc' : themeColors.card },
            ]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text
              style={[
                styles.tagText,
                {
                  color: selectedTag === tag ? '#fff' : themeColors.text,
                },
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save Thought" onPress={handleSave} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Go to Inbox" onPress={() => navigation.navigate('Inbox')} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginVertical: 5,
  },
});
