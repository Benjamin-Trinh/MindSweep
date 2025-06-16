import { saveThought } from '../utils/storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CaptureScreen() {
  const [thought, setThought] = useState('');

  const handleSave = async () => {
    if (!thought.trim()) return;
    await saveThought(thought);
    setThought('');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>MindSweep</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={thought}
        onChangeText={setThought}
        multiline
      />
      <Button title="Save Thought" onPress={handleSave} />
    </View>
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
  },
});
