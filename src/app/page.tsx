import GameCanvas from '@/components/game/game-canvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 font-body">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary">Shape Shooter Showdown</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-2">Use arrow keys to move, Space to shoot. Survive and win!</p>
      </div>
      <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] rounded-lg overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20">
        <GameCanvas />
      </div>
    </main>
  );
}
