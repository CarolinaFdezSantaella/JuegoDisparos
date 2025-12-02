import { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Canvas from 'react-native-canvas';
import { Game, GameState } from '../../lib/game-engine/Game';
import GameHud from './ui/GameHud';
import StartScreen from './ui/StartScreen';
import GameOverScreen from './ui/GameOverScreen';

const PLAYER_LIVES = 3;

export default function GameCanvas() {
  const gameInstanceRef = useRef<Game | null>(null);
  const animationFrameId = useRef<number>(0);
  const canvasRef = useRef<any>(null);

  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_LIVES);
  const [loading, setLoading] = useState(false);

  const stopGame = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = 0;
    }
    if (gameInstanceRef.current) {
      gameInstanceRef.current.endGame(true);
    }
  }, []);

  const gameLoop = useCallback(() => {
    if (gameInstanceRef.current && gameInstanceRef.current.gameState === 'playing') {
      gameInstanceRef.current.update();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  const startGame = useCallback(() => {
    if (!canvasRef.current) return;

    stopGame();

    const canvas = canvasRef.current;

    setScore(0);
    setLives(PLAYER_LIVES);
    setGameState('playing');

    const game = new Game(
      canvas,
      (newScore: number) => setScore(newScore),
      (newLives: number) => setLives(newLives),
      (newState: GameState) => setGameState(newState),
      PLAYER_LIVES
    );
    gameInstanceRef.current = game;
    game.start();

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [stopGame, gameLoop]);

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, [stopGame]);

  const handleCanvas = (canvas: any) => {
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
      canvasRef.current = canvas;
    }
  };

  const handleTouchStart = (event: any) => {
    if (gameInstanceRef.current && event.nativeEvent) {
      const touch = event.nativeEvent.touches?.[0];
      if (touch) {
        gameInstanceRef.current.setTouchDown(touch.pageX);
      }
    }
  };

  const handleTouchMove = (event: any) => {
    if (gameInstanceRef.current && event.nativeEvent) {
      const touch = event.nativeEvent.touches?.[0];
      if (touch) {
        gameInstanceRef.current.setTouchDown(touch.pageX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.setTouchDown(null);
    }
  };

  return (
    <View style={styles.container}>
      <Canvas
        ref={handleCanvas}
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {gameState === 'playing' && <GameHud score={score} lives={lives} />}
      {gameState === 'start' && <StartScreen onStart={startGame} loading={loading} />}
      {(gameState === 'win' || gameState === 'game_over') && (
        <GameOverScreen onRestart={startGame} score={score} didWin={gameState === 'win'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
