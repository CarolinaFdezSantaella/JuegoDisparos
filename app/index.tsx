import { View, Text, StyleSheet } from 'react-native';
import GameCanvas from '../components/game/GameCanvas';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shape Shooter Showdown</Text>
        <Text style={styles.subtitle}>
          Touch to move, Auto-fire enabled. Survive and win!
        </Text>
      </View>
      <View style={styles.gameContainer}>
        <GameCanvas />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#60a5fa',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
});
