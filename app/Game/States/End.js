import 'pixi';
import 'p2';
import "phaser";

class End extends Phaser.State {
	init() {
		this.add.sprite(0, 0, this.game.winGameYes ? 'endscreen' : 'failscreen');

		if (!this.game.winGameYes) {
			var audio = this.add.audio('end1');
			audio.onStop.addOnce(function() {
				var audio = this.add.audio('end2');
				audio.play();
			}.bind(this));
			audio.play();
		}
	}
}

export default End;
