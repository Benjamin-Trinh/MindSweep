import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveThought } from '../utils/storage';
import { RootStackParamList } from '../navigation/types';

type CaptureScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Capture'
>;

export default function CaptureScreen() {
  const [thought, setThought] = useState('');
  const navigation = useNavigation<CaptureScreenNavigationProp>();

  const handleSave = async () => {
    if (!thought.trim()) return;
    await saveThought(thought);
    setThought('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>MindSweep</Text>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={thought}
        onChangeText={setThought}
        multiline
      />

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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginVertical: 5,
  },
});
