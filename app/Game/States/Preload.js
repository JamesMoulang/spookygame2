import 'pixi';
import 'p2';
import "phaser";

class Preload extends Phaser.State {
	preload() {
		this.load.image('ghost', '/ghost.png');
		this.load.image('square', '/square.png');
		this.load.image('slot', '/slot.png');
		this.load.image('door', '/door.png');
		this.load.image('endscreen', '/endscreen.png');
		this.load.image('failscreen', '/failscreen.png');
		this.load.image('torch', '/torch.png');

		this.load.audio('music', '/music.wav');
		this.load.audio('steps1', '/steps 1-Audio.wav');
		this.load.audio('steps2', '/steps 2-Audio.wav');
		this.load.audio('steps3', '/steps 3-Audio.wav');
		this.load.audio('steps4', '/steps 4-Audio.wav');
		this.load.audio('steps5', '/steps 5-Audio.wav');
		this.load.audio('steps6', '/steps 6-Audio.wav');

		this.load.audio('ouch1', '/ouch1.wav');
		this.load.audio('ouch2', '/ouch2.wav');
		this.load.audio('ouch3', '/ouch3.wav');
		this.load.audio('ouch4', '/ouch4.wav');
		this.load.audio('slam', '/ouch5.wav');

		this.load.image('blood1', '/blood1.png');
		this.load.image('blood2', '/blood2.png');
		this.load.image('blood3', '/blood3.png');

		this.load.image('man_injured', '/man_injured.png');
		this.load.image('man_injured_walk_1', '/man_injured_walk_1.png');
		this.load.image('man_injured_walk_2', '/man_injured_walk_2.png');
		this.load.image('man_injured_fall', '/man_injured_fall.png');

		this.load.image('man_healthy', '/man_healthy.png');
		this.load.image('man_healthy_walk_1', '/man_healthy_walk_1.png');
		this.load.image('man_healthy_walk_2', '/man_healthy_walk_2.png');
		this.load.image('man_healthy_fall', '/man_healthy_fall.png');

		this.load.audio('chain', '/chain.wav');
		this.load.audio('monster', '/monster.wav');

		this.load.audio('end1', '/end1.wav');
		this.load.audio('end2', '/end2.wav');
	}

	create() {
		this.state.start('main');
	}
}

export default Preload;
