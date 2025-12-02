import { View, Text, StyleSheet } from 'react-native';

interface GameHudProps {
  score: number;
  lives: number;
}

export default function GameHud({ score, lives }: GameHudProps) {
  return (
    <View style={styles.container}>
      <View style={styles.hudRow}>
        <View style={styles.hudItem}>
          <Text style={styles.icon}>⭐</Text>
          <Text style={styles.text}>Score: {score}</Text>
        </View>
        <View style={styles.hudItem}>
          <Text style={styles.icon}>❤️</Text>
          <Text style={styles.text}>Lives: {lives}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
