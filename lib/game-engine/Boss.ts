import { Opponent } from './Opponent';

export class Boss extends Opponent {
    constructor(canvas: HTMLCanvasElement, onScore: () => void) {
        // Boss is larger than a normal opponent
        const bossSize = canvas.width / 8;

        super(canvas, onScore, bossSize);
        
        this.x = canvas.width / 2 - bossSize / 2;
        this.y = bossSize / 4;

        // Boss moves slower
        this.speed = (canvas.width / 400);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.dead) {
            // Draw explosion/star
            ctx.fillStyle = '#FFD700'; // Gold color for star
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const spikes = 12;
            const outerRadius = this.width / 2;
            const innerRadius = this.width / 4;
            let rot = Math.PI / 2 * 3;
            let x = centerX;
            let y = centerY;
            const step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = centerX + Math.cos(rot) * outerRadius;
                y = centerY + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = centerX + Math.cos(rot) * innerRadius;
                y = centerY + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(centerX, centerY - outerRadius);
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw boss triangle
            ctx.fillStyle = 'purple';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height); // Point down
            ctx.lineTo(this.x, this.y);
            ctx.lineTo(this.x + this.width, this.y);
            ctx.closePath();
            ctx.fill();
        }
    }
}
