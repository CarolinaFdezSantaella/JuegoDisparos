import { Entity } from './Entity';

export class Character extends Entity {
    public dead: boolean = false;
    
    constructor(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(x, y, width, height);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // This method will be overridden by subclasses
    }

    collide(): void {
        if (!this.dead) {
            this.dead = true;
        }
    }
}
