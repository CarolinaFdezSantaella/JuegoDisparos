import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  loading: boolean;
}

const StartScreen: FC<StartScreenProps> = ({ onStart, loading }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
      <h2 className="text-6xl font-bold font-headline text-primary mb-2">Ready?</h2>
      <p className="text-xl text-muted-foreground mb-8">Defeat the shapes and face the final boss!</p>
      <Button onClick={onStart} size="lg" className="font-headline text-2xl px-8 py-6" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Start Game'}
      </Button>
    </div>
  );
};

export default StartScreen;
