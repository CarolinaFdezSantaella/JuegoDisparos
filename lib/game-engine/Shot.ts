import { Entity } from './Entity';

export class Shot extends Entity {
    private speed: number;
    private isOpponentShot: boolean;

    constructor(x: number, y: number, canvasHeight: number, isOpponentShot: boolean = false) {
        const shotWidth = canvasHeight / 120;
        const shotHeight = canvasHeight / 60;
        super(x, y, shotWidth, shotHeight);
        
        this.isOpponentShot = isOpponentShot;
        this.speed = canvasHeight / 80;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.isOpponentShot ? '#ef4444' : '#60a5fa'; // Red for opponent, blue for player
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(): void {
        if(this.isOpponentShot) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    }
    
    isOffScreen(): boolean {
        return this.y < -this.height || this.y > this.speed * 100; // a bit more than canvas height
    }
}
