import type { FC } from 'react';
import { Heart, Star } from 'lucide-react';

interface GameHudProps {
  score: number;
  lives: number;
}

const GameHud: FC<GameHudProps> = ({ score, lives }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 text-white font-headline">
      <ul className="flex justify-between text-2xl">
        <li id="scoreli" className="flex items-center gap-2 text-accent">
          <Star className="w-6 h-6" fill="currentColor" />
          <span>Score: {score}</span>
        </li>
        <li id="livesli" className="flex items-center gap-2 text-primary">
          <Heart className="w-6 h-6" fill="currentColor" />
          <span>Lives: {lives}</span>
        </li>
      </ul>
    </div>
  );
};

export default GameHud;
