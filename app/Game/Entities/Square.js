import 'pixi';
import 'p2';
import "phaser";

import Vector from '../Helpers/Vector';
import Maths from '../Helpers/Maths';

class Square extends Phaser.Sprite {
	constructor(game, x, y, pos) {
		super(game, x, y, 'square');
		game.world.add(this);
		this.killme = false;
		this.disappear = false;
		this.pos = pos;
		this.door = false;
		this.torch = null;
	}

	destroyme(time) {
		this.killme = true;
		setTimeout(function() {
			this.disappear = true;
		}.bind(this), time);
	}

	update() {
		if (this.disappear) {
			this.alpha = Maths.lerp(this.alpha, 0.1, 0);
			if (this.alpha < 0.1) {
				this.main.killSquare(this.pos.x, this.pos.y);
			}
		}
	}
}

export default Square;
