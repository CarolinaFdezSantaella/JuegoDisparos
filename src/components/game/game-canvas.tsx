"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Game, GameState } from '@/lib/game-engine/game';
import GameHud from '@/components/game/ui/game-hud';
import StartScreen from '@/components/game/ui/start-screen';
import GameOverScreen from '@/components/game/ui/game-over-screen';

const PLAYER_LIVES = 3;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstanceRef = useRef<Game | null>(null);
  const animationFrameId = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_LIVES);

  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);
  
  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);
  
  const gameLoop = useCallback(() => {
    if (!gameInstanceRef.current) return;
    gameInstanceRef.current.update();
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  const stopGame = useCallback(() => {
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = 0;
    }
    if (gameInstanceRef.current) {
        gameInstanceRef.current.endGame(true);
        gameInstanceRef.current = null;
    }
  },[]);


  const startGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    stopGame();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setScore(0);
    setLives(PLAYER_LIVES);
    
    const game = new Game(
      canvas,
      handleScoreChange,
      handleLivesChange,
      handleGameStateChange,
      PLAYER_LIVES
    );
    gameInstanceRef.current = game;
    game.start();
    setGameState('playing');

  }, [stopGame, handleGameStateChange, handleScoreChange, handleLivesChange]);

  useEffect(() => {
    if (gameState === 'playing') {
      if(animationFrameId.current === 0) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    } else {
      stopGame();
    }

    return () => {
      stopGame();
    };
  }, [gameState, gameLoop, stopGame]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(gameInstanceRef.current) gameInstanceRef.current.setKeyPressed(e.code);
    }
    const handleKeyUp = () => {
        if(gameInstanceRef.current) gameInstanceRef.current.setKeyPressed(null);
    }
    const handleTouchStart = (e: TouchEvent) => {
        if(gameInstanceRef.current) {
            e.preventDefault();
            gameInstanceRef.current.setTouchDown(e.touches[0].clientX);
        }
    };
    const handleTouchMove = (e: TouchEvent) => {
        if(gameInstanceRef.current) {
            e.preventDefault();
            gameInstanceRef.current.setTouchDown(e.touches[0].clientX);
        }
    };
    const handleTouchEnd = (e: TouchEvent) => {
        if(gameInstanceRef.current) {
            e.preventDefault();
            gameInstanceRef.current.setTouchDown(null);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvas = canvasRef.current;
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas?.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas?.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('touchmove', handleTouchMove);
      canvas?.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);


  return (
    <div className="w-full h-full bg-background relative touch-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      {gameState === 'playing' && <GameHud score={score} lives={lives} />}
      {gameState === 'start' && <StartScreen onStart={startGame} loading={false} />}
      {(gameState === 'win' || gameState === 'game_over') && (
        <GameOverScreen onRestart={startGame} score={score} didWin={gameState === 'win'} />
      )}
    </div>
  );
}
