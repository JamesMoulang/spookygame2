import 'pixi';
import 'p2';
import "phaser";

import Vector from '../Helpers/Vector';
import Maths from '../Helpers/Maths';

class Torch extends Phaser.Sprite {
	constructor(game, x, y, pos) {
		super(game, x, y, 'torch');
		game.world.add(this);
		this.anchor.set(0.5, 1);
	}
}

export default Torch;
