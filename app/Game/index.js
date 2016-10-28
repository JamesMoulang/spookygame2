import 'pixi';
import 'p2';
import "phaser";

import { Boot, Preload, Main, End } from './States';

class Game extends Phaser.Game {
	constructor() {
		super(240, 200, Phaser.CANVAS, 'content', null, false, false);
		this.state.add('boot', Boot);
		this.state.add('preload', Preload);
		this.state.add('main', Main);
		this.state.add('end', End);

		this.state.start('boot');
	}
}

export default Game;
