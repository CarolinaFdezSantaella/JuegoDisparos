import { Character } from './character';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const RESPAWN_TIME_MS = 2000;
const SHOT_COOLDOWN_MS = 300;

export class Player extends Character {
    public lives: number;
    private isRespawning: boolean = false;
    private lastShotTime: number = 0;
    private addShotCallback: () => void;
    private endGameCallback: () => void;

    constructor(
        canvas: HTMLCanvasElement, 
        initialLives: number,
        addShotCallback: () => void,
        endGameCallback: () => void
    ) {
        const playerImage = PlaceHolderImages.find(img => img.id === 'player');
        const starImage = PlaceHolderImages.find(img => img.id === 'star');
        const playerSize = canvas.width / 20;

        super(
            canvas.width / 2 - playerSize / 2, 
            canvas.height - playerSize * 1.5, 
            playerSize, 
            playerSize, 
            playerImage?.imageUrl || '',
            starImage?.imageUrl || ''
        );
        this.lives = initialLives;
        this.addShotCallback = addShotCallback;
        this.endGameCallback = endGameCallback;
    }
    
    update(updateLives: (lives: number) => void): void {
        if(this.dead && !this.isRespawning) {
            this.isRespawning = true;
            if (this.lives > 0) {
                setTimeout(() => this.respawn(updateLives), RESPAWN_TIME_MS);
            } else {
                this.endGameCallback();
            }
        }
    }

    collide(): void {
        if (this.dead || this.isRespawning) return;
        
        this.lives--;
        super.collide(); // Sets this.dead = true and changes image
    }
    
    private respawn(updateLives: (lives: number) => void): void {
        this.dead = false;
        this.isRespawning = false;
        this.image = this.myImage;
        updateLives(this.lives);
    }
    
    public isInvincible(): boolean {
        return this.isRespawning;
    }

    public canShoot(): boolean {
        return Date.now() - this.lastShotTime > SHOT_COOLDOWN_MS;
    }

    public resetShotCooldown(): void {
        this.lastShotTime = Date.now();
    }
}
