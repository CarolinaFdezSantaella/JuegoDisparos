import { Entity } from './entity';

export class Character extends Entity {
    public dead: boolean = false;
    public myImage: HTMLImageElement;
    public deadImage: HTMLImageElement;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        myImageSrc: string,
        deadImageSrc: string
    ) {
        super(x, y, width, height, myImageSrc);
        this.myImage = new Image();
        this.myImage.src = myImageSrc;
        this.deadImage = new Image();
        this.deadImage.src = deadImageSrc;
    }

    collide(): void {
        if (!this.dead) {
            this.dead = true;
            this.image = this.deadImage;
        }
    }
}
