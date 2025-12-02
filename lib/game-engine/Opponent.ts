import { Character } from './Character';

export class Opponent extends Character {
    public speed: number;
    private onScore: () => void;
    private direction: number = 1;
    private canvas: HTMLCanvasElement;

    constructor(
        canvas: HTMLCanvasElement, 
        onScore: () => void,
        size: number = canvas.width / 15
    ) {

        super(
            Math.random() * (canvas.width - size), 
            size / 2, 
            size, 
            size
        );
        this.canvas = canvas;
        this.speed = canvas.width / 200;
        this.onScore = onScore;
    }

    update(): void {
        if (this.dead) return;
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x + this.width >= this.canvas.width) {
            this.direction *= -1;
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
        } else {
             // Draw opponent triangle
            ctx.fillStyle = '#fbbf24'; // Accent yellow color
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height); // Point down
            ctx.lineTo(this.x, this.y);
            ctx.lineTo(this.x + this.width, this.y);
            ctx.closePath();
            ctx.fill();
        }
    }

    collide(): void {
        if (!this.dead) {
            super.collide();
            this.onScore();
        }
    }
}
