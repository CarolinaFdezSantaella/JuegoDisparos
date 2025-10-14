import { Player } from './player';
import { Opponent } from './opponent';
import { Boss } from './boss';
import { Shot } from './shot';

export type GameState = 'start' | 'playing' | 'win' | 'game_over';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    public player: Player;
    public opponents: (Opponent | Boss)[] = [];
    public shots: Shot[] = [];
    public opponentShots: Shot[] = [];

    public score: number = 0;
    public gameState: GameState = 'start';
    private gameWon: boolean = false;

    private keyPressed: string | null = null;
    private touchDownX: number | null = null;
    private opponentsToSpawn: number = 5;

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

        this.updateScore(this.score);
        this.updateLives(this.player.lives);
    }

    public start(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 10;
        this.gameState = 'playing';
        this.spawnOpponentFleet();
    }

    private spawnOpponentFleet(): void {
        for (let i = 0; i < this.opponentsToSpawn; i++) {
            setTimeout(() => this.spawnOpponent(), i * 500);
        }
    }

    private spawnOpponent(): void {
        const opponent = new Opponent(this.canvas, () => {
            this.score += 1;
            this.updateScore(this.score);
        });
        this.opponents.push(opponent);
    }

    private spawnBoss(): void {
        const boss = new Boss(this.canvas, () => {
            this.score += 10; // More points for the boss
            this.updateScore(this.score);
        });
        this.opponents.push(boss);
    }

    private addShot(): void {
        if (this.player.canShoot() && this.gameState === 'playing' && !this.player.dead) {
            this.shots.push(new Shot(this.player.x + this.player.width / 2 - 2.5, this.player.y, this.canvas.height));
            this.player.resetShotCooldown();
        }
    }

    private addOpponentShot(opponent: Opponent | Boss): void {
        if (opponent && !opponent.dead && Math.random() < 0.02) {
             this.opponentShots.push(new Shot(opponent.x + opponent.width / 2, opponent.y + opponent.height, this.canvas.height, true));
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

        this.opponents.forEach(opponent => {
            opponent.update();
            this.addOpponentShot(opponent);
        });
        
        this.checkCollisions();
        
        const aliveOpponents = this.opponents.filter(opponent => !opponent.dead);

        if (this.opponents.length > 0 && aliveOpponents.length === 0) {
            if (this.opponents.some(o => o instanceof Boss)) {
                 // All opponents including boss are dead
                this.gameWon = true;
                this.endGame();
            } else {
                 // All normal opponents are dead, spawn boss
                this.opponents = [];
                this.spawnBoss();
            }
        }

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
        // Player shots hitting opponents
        this.opponents.forEach(opponent => {
            if (!opponent.dead) {
                this.shots.forEach(shot => {
                    if (
                        !shot.isOffScreen() &&
                        shot.x < opponent.x + opponent.width &&
                        shot.x + shot.width > opponent.x &&
                        shot.y < opponent.y + opponent.height &&
                        shot.y + shot.height > opponent.y
                    ) {
                        shot.y = -100; // remove shot
                        opponent.collide();
                    }
                });
            }
        });

        // Opponent shots hitting player
        if (!this.player.dead && !this.player.isInvincible()) {
             this.opponentShots.forEach(shot => {
                if (
                    !shot.isOffScreen() &&
                    shot.x < this.player.x + this.player.width &&
                    shot.x + shot.width > this.player.x &&
                    shot.y < this.player.y + this.player.height &&
                    shot.y + shot.height > this.player.y
                ) {
                    shot.y = this.canvas.height + 100; // remove shot
                    this.player.collide();
                }
            });
        }
    }
    
    public endGame(): void {
        if (this.gameState !== 'playing') return;
        
        this.gameState = this.gameWon ? 'win' : 'game_over';
        this.setGameState(this.gameState);
    }
    
    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.opponents.forEach(opponent => opponent.draw(this.ctx));
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
