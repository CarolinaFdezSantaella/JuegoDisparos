import { Entity } from './entity';

export class Shot extends Entity {
    private speed: number;
    private isOpponentShot: boolean;

    constructor(x: number, y: number, canvasHeight: number, isOpponentShot: boolean = false) {
        const shotSize = canvasHeight / 60;
        super(x, y, shotSize, shotSize * 2, ''); // No initial image src
        
        // Dynamically create a canvas for the shot's appearance
        const shotCanvas = document.createElement('canvas');
        const shotCtx = shotCanvas.getContext('2d')!;
        shotCanvas.width = shotSize;
        shotCanvas.height = shotSize * 2;
        shotCtx.fillStyle = isOpponentShot ? '#FF8C00' : '#7DF9FF'; // Orange for opponent, blue for player
        shotCtx.fillRect(0, 0, shotSize, shotSize*2);
        this.image.src = shotCanvas.toDataURL();
        
        this.isOpponentShot = isOpponentShot;
        this.speed = canvasHeight / 80;
    }

    update(): void {
        if(this.isOpponentShot) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    }
    
    isOffScreen(): boolean {
        return this.y < 0 || this.y > this.speed * 100; // a bit more than canvas height
    }
}
