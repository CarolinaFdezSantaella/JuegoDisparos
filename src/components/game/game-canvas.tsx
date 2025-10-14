"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Game, GameState } from '@/lib/game-engine/game';
import GameHud from '@/components/game/ui/game-hud';
import StartScreen from '@/components/game/ui/start-screen';
import GameOverScreen from '@/components/game/ui/game-over-screen';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PLAYER_LIVES = 3;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstanceRef = useRef<Game | null>(null);
  const animationFrameId = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_LIVES);
  const [isReady, setIsReady] = useState(false);

  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);
  
  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const imagesToLoad = PlaceHolderImages.length;
    if (imagesToLoad === 0) {
      setIsReady(true);
      return;
    }

    PlaceHolderImages.forEach(p_image => {
        const img = new Image();
        img.src = p_image.imageUrl;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === imagesToLoad) {
                setIsReady(true);
            }
        };
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === imagesToLoad) {
                setIsReady(true);
            }
        }
    });
  }, []);
  
  const gameLoop = useCallback(() => {
    if (gameInstanceRef.current?.gameState === 'playing') {
      gameInstanceRef.current.update();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  const startGame = useCallback(() => {
    if (!canvasRef.current || !isReady) return;

    if (gameInstanceRef.current) {
      gameInstanceRef.current.endGame();
      cancelAnimationFrame(animationFrameId.current);
    }
    
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

  }, [isReady, handleGameStateChange, handleScoreChange, handleLivesChange]);

  useEffect(() => {
    if (gameState === 'playing' && gameInstanceRef.current) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(animationFrameId.current);
    }
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [gameState, gameLoop]);


  useEffect(() => {
    const game = gameInstanceRef.current;
    if (!game) return;

    const handleKeyDown = (e: KeyboardEvent) => game.setKeyPressed(e.code);
    const handleKeyUp = () => game.setKeyPressed(null);
    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        game.setTouchDown(e.touches[0].clientX)
    };
    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        game.setTouchDown(e.touches[0].clientX)
    };
    const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        game.setTouchDown(null)
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvas = canvasRef.current;
    canvas?.addEventListener('touchstart', handleTouchStart);
    canvas?.addEventListener('touchmove', handleTouchMove);
    canvas?.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('touchmove', handleTouchMove);
      canvas?.removeEventListener('touchend', handleTouchEnd);
      
      gameInstanceRef.current?.endGame();
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState]);


  return (
    <div className="w-full h-full bg-background relative touch-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      {gameState === 'playing' && <GameHud score={score} lives={lives} />}
      {gameState === 'start' && <StartScreen onStart={startGame} loading={!isReady} />}
      {(gameState === 'win' || gameState === 'game_over') && (
        <GameOverScreen onRestart={startGame} score={score} didWin={gameState === 'win'} />
      )}
    </div>
  );
}
