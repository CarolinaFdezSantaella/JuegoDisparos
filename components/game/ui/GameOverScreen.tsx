import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameOverScreenProps {
  onRestart: () => void;
  score: number;
  didWin: boolean;
}

export default function GameOverScreen({ onRestart, score, didWin }: GameOverScreenProps) {
  const title = didWin ? "You Win!" : "Game Over";
  const titleColor = didWin ? '#22c55e' : '#ef4444';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={styles.score}>Final Score: {score}</Text>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Play Again</Text>
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
    marginBottom: 16,
  },
  score: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#60a5fa',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
