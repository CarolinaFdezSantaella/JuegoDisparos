import { Character } from './character';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export class Opponent extends Character {
    public speed: number;
    private onScore: () => void;
    private direction: number = 1;
    private canvas: HTMLCanvasElement;

    constructor(
        canvas: HTMLCanvasElement, 
        onScore: () => void,
        size: number = canvas.width / 15,
        imageSrc?: string,
        deadImageSrc?: string
    ) {
        const opponentImage = PlaceHolderImages.find(img => img.id === 'opponent');
        const starImage = PlaceHolderImages.find(img => img.id === 'star');

        super(
            Math.random() * (canvas.width - size), 
            size / 2, 
            size, 
            size, 
            imageSrc || opponentImage?.imageUrl || '',
            deadImageSrc || starImage?.imageUrl || ''
        );
        this.canvas = canvas;
        this.speed = canvas.width / 100;
        this.onScore = onScore;
    }

    update(): void {
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x + this.width >= this.canvas.width) {
            this.direction *= -1;
        }
    }

    collide(): void {
        if (!this.dead) {
            super.collide();
            this.onScore();
        }
    }
}
