import { Opponent } from './opponent';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export class Boss extends Opponent {
    constructor(canvas: HTMLCanvasElement, onScore: () => void) {
        const bossImage = PlaceHolderImages.find(img => img.id === 'boss');
        const bossDeadImage = PlaceHolderImages.find(img => img.id === 'star');
        
        // Boss is larger than a normal opponent
        const bossSize = canvas.width / 12;

        super(canvas, onScore, bossSize, bossImage?.imageUrl || '', bossDeadImage?.imageUrl || '');

        // Boss moves at double the speed of a normal opponent
        this.speed = (canvas.width / 100) * 2;
    }
}
