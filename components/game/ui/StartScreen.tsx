import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface StartScreenProps {
  onStart: () => void;
  loading: boolean;
}

export default function StartScreen({ onStart, loading }: StartScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready?</Text>
      <Text style={styles.subtitle}>Defeat the shapes and face the final boss!</Text>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onStart}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.buttonText}>Start Game</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#9ca3af',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#60a5fa',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
