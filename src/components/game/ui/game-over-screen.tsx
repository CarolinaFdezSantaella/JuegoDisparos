import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface GameOverScreenProps {
  onRestart: () => void;
  score: number;
  didWin: boolean;
}

const GameOverScreen: FC<GameOverScreenProps> = ({ onRestart, score, didWin }) => {
  const image = didWin ? PlaceHolderImages.find(img => img.id === 'youWin') : PlaceHolderImages.find(img => img.id === 'gameOver');
  const title = didWin ? "You Win!" : "Game Over";
  const titleColor = didWin ? "text-accent" : "text-destructive";

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
      {image && (
        <Image 
          src={image.imageUrl} 
          alt={title} 
          width={400} 
          height={200}
          data-ai-hint={image.imageHint}
          className="mb-4 rounded-lg"
        />
      )}
      <h2 className={`text-6xl font-bold font-headline mb-4 ${titleColor}`}>{title}</h2>
      <p className="text-3xl text-white mb-8">Final Score: {score}</p>
      <Button onClick={onRestart} size="lg" className="font-headline text-2xl px-8 py-6">
        Play Again
      </Button>
    </div>
  );
};

export default GameOverScreen;
