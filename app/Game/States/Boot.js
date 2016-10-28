import 'pixi';
import 'p2';
import "phaser";

class Boot extends Phaser.State {
	preload() {

	}

	init() {
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	}

	create() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.state.start('preload');
	}
}

export default Boot;
