"use client";

import { Character } from './character';

const RESPAWN_TIME_MS = 2000;
const SHOT_COOLDOWN_MS = 300;

export class Player extends Character {
    public lives: number;
    private isRespawning: boolean = false;
    private lastShotTime: number = 0;
    private endGameCallback: (force: boolean) => void;
    private canvas: HTMLCanvasElement;

    constructor(
        canvas: HTMLCanvasElement, 
        initialLives: number,
        addShotCallback: () => void,
        endGameCallback: (force: boolean) => void
    ) {
        const playerSize = canvas.width / 15;
        super(
            canvas.width / 2 - playerSize / 2, 
            canvas.height - playerSize * 1.5, 
            playerSize, 
            playerSize
        );
        this.lives = initialLives;
        this.endGameCallback = endGameCallback;
        this.canvas = canvas;
    }
    
    update(updateLives: (lives: number) => void): void {
        if(this.dead && !this.isRespawning) {
            this.isRespawning = true;
            if (this.lives > 0) {
                setTimeout(() => this.respawn(updateLives), RESPAWN_TIME_MS);
            } else {
                this.endGameCallback(true);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.dead) {
            // Draw explosion/star
            ctx.fillStyle = '#FFD700'; // Gold color for star
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width * 0.6, this.y + this.height * 0.4);
            ctx.lineTo(this.x + this.width, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width * 0.6, this.y + this.height * 0.6);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.6);
            ctx.lineTo(this.x, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.4);
            ctx.closePath();
            ctx.fill();
        } else if (!this.isInvincible() || (this.isInvincible() && Math.floor(Date.now() / 150) % 2 === 0)) {
            // Draw player triangle (and blink if invincible)
            ctx.fillStyle = 'hsl(var(--primary))';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
    }


    collide(): void {
        if (this.dead || this.isRespawning) return;
        
        this.lives--;
        super.collide(); // Sets this.dead = true
    }
    
    private respawn(updateLives: (lives: number) => void): void {
        this.dead = false;
        this.isRespawning = false;
        this.x = this.canvas.width / 2 - this.width / 2;
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
