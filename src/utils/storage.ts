import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'MINDSWEEP_THOUGHTS';

export async function saveThought(thought: string) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const thoughts = existing ? JSON.parse(existing) : [];
    thoughts.unshift({ id: Date.now(), content: thought }); // newest first
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  } catch (error) {
    console.error('Error saving thought:', error);
  }
}

export async function loadThoughts() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading thoughts:', error);
    return [];
  }
}
