import { Opponent } from './opponent';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export class Boss extends Opponent {
    constructor(canvas: HTMLCanvasElement, onScore: () => void) {
        const bossImage = PlaceHolderImages.find(img => img.id === 'boss');
        const bossDeadImage = PlaceHolderImages.find(img => img.id === 'star');
        
        // Boss is larger than a normal opponent
        const bossSize = canvas.width / 8;

        super(canvas, onScore, bossSize, bossImage?.imageUrl || '', bossDeadImage?.imageUrl || '');
        
        this.x = canvas.width / 2 - bossSize / 2;
        this.y = bossSize / 4;

        // Boss moves slower
        this.speed = (canvas.width / 400);
    }
}
