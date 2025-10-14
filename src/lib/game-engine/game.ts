import { Player } from './player';
import { Opponent } from './opponent';
import { Boss } from './boss';
import { Shot } from './shot';

const GAME_SPEED_MS = 50; // Approx 20 FPS

export type GameState = 'start' | 'playing' | 'win' | 'game_over';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    public player: Player;
    public opponent: Opponent | Boss | null = null;
    public shots: Shot[] = [];
    public opponentShots: Shot[] = [];

    public score: number = 0;
    public gameState: GameState = 'start';
    private gameWon: boolean = false;

    private keyPressed: string | null = null;
    private touchDownX: number | null = null;

    // Callbacks to update React state
    private updateScore: (score: number) => void;
    private updateLives: (lives: number) => void;
    private setGameState: (state: GameState) => void;

    constructor(
        canvas: HTMLCanvasElement,
        updateScore: (score: number) => void,
        updateLives: (lives: number) => void,
        setGameState: (state: GameState) => void,
        initialLives: number
    ) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.player = new Player(canvas, initialLives, this.addShot.bind(this), this.endGame.bind(this));
        
        this.updateScore = updateScore;
        this.updateLives = updateLives;
        this.setGameState = setGameState;
    }

    public start(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 10;
        this.gameState = 'playing';
        this.spawnOpponent();
    }

    private spawnOpponent(): void {
        this.opponent = new Opponent(this.canvas, () => {
            this.score += 1;
            this.updateScore(this.score);
        });
    }

    private spawnBoss(): void {
        this.opponent = new Boss(this.canvas, () => {
            this.score += 1;
            this.updateScore(this.score);
        });
    }

    private addShot(): void {
        if (this.player.canShoot() && this.gameState === 'playing') {
            this.shots.push(new Shot(this.player.x + this.player.width / 2 - 2.5, this.player.y, this.canvas.height));
            this.player.resetShotCooldown();
        }
    }

    private addOpponentShot(): void {
        if (this.opponent && !this.opponent.dead && Math.random() < 0.02) {
             this.opponentShots.push(new Shot(this.opponent.x + this.opponent.width / 2, this.opponent.y + this.opponent.height, this.canvas.height, true));
        }
    }

    public update(): void {
        if (this.gameState !== 'playing') return;

        this.handlePlayerMovement();
        this.player.update(this.updateLives);

        this.shots.forEach(shot => shot.update());
        this.shots = this.shots.filter(shot => !shot.isOffScreen());

        this.opponentShots.forEach(shot => shot.update());
        this.opponentShots = this.opponentShots.filter(shot => !shot.isOffScreen());

        if (this.opponent) {
            this.opponent.update();
            this.addOpponentShot();
        }
        
        this.checkCollisions();
        this.draw();
    }

    private handlePlayerMovement(): void {
        const playerSpeed = this.canvas.width / 100;
        if (this.keyPressed === 'ArrowRight' || this.keyPressed === 'KeyD') {
            this.player.x = Math.min(this.player.x + playerSpeed, this.canvas.width - this.player.width);
        } else if (this.keyPressed === 'ArrowLeft' || this.keyPressed === 'KeyA') {
            this.player.x = Math.max(this.player.x - playerSpeed, 0);
        } else if (this.keyPressed === 'Space') {
            this.addShot();
        }

        if (this.touchDownX !== null) {
            this.player.x = Math.max(0, Math.min(this.touchDownX - this.player.width / 2, this.canvas.width - this.player.width));
            if(Math.random() < 0.1) this.addShot(); // Auto-fire on touch
        }
    }

    private checkCollisions(): void {
        // Player shots hitting opponent
        if (this.opponent && !this.opponent.dead) {
            this.shots.forEach(shot => {
                if (
                    shot.x < this.opponent!.x + this.opponent!.width &&
                    shot.x + shot.width > this.opponent!.x &&
                    shot.y < this.opponent!.y + this.opponent!.height &&
                    shot.y + shot.height > this.opponent!.y
                ) {
                    shot.y = -100; // remove shot
                    this.opponent!.collide();
                    this.removeOpponent();
                }
            });
        }

        // Opponent shots hitting player
        if (!this.player.dead && !this.player.isInvincible()) {
             this.opponentShots.forEach(shot => {
                if (
                    shot.x < this.player.x + this.player.width &&
                    shot.x + shot.width > this.player.x &&
                    shot.y < this.player.y + this.player.height &&
                    shot.y + shot.height > this.player.y
                ) {
                    shot.y = this.canvas.height + 100; // remove shot
                    this.player.collide();
                    this.updateLives(this.player.lives);
                }
            });
        }
    }
    
    private removeOpponent(): void {
        setTimeout(() => {
            if (this.opponent instanceof Boss) {
                // Boss defeated
                this.opponent = null;
                this.gameWon = true;
                this.endGame();
            } else {
                // Regular opponent defeated, spawn boss
                this.opponent = null;
                this.spawnBoss();
            }
        }, 1000); // Time to see the star
    }

    public endGame(): void {
        if (this.gameState !== 'playing') return;
        
        this.gameState = this.gameWon ? 'win' : 'game_over';
        this.setGameState(this.gameState);
    }
    
    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.opponent?.draw(this.ctx);
        this.shots.forEach(shot => shot.draw(this.ctx));
        this.opponentShots.forEach(shot => shot.draw(this.ctx));
    }

    public setKeyPressed(key: string | null): void {
        this.keyPressed = key;
    }

    public setTouchDown(x: number | null): void {
        this.touchDownX = x;
    }
}
