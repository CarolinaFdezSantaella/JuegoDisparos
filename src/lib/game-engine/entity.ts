export class Entity {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public image: HTMLImageElement;

    constructor(x: number, y: number, width: number, height: number, imgSrc: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgSrc;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
