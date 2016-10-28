import 'pixi';
import 'p2';
import "phaser";

import Vector from '../Helpers/Vector';
import Maths from '../Helpers/Maths';

class Ghost extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, 'ghost');
		game.world.add(this);
		this.anchor.set(0.5, 1);
		this.facing = new Vector(1, 0);
		this.idealWidth = this.width + 0;
		this.updateFacing();
		this.pos = new Vector(x, y);
		this.showing = false;
		this.alpha = 0;
		this.depth = 1;
		this.angry = false;
		this.wakeTime = 0;
		this.angryTime = 2500;
		this.lastHurtTime = this.game.time.time;

		this.chainAudio = this.game.add.audio('chain', 0, true);
		this.monsterAudio = this.game.add.audio('monster', 0, true);
	}

	updateFacing() {
		this.width = this.idealWidth * this.facing.x;
	}

	disappear() {
		var ghost_x = 80 + (Math.random()) * 16;
		if (Math.random() < 0.5) {
			ghost_x *= -1;
		}
		var ghost_y = 80 + (Math.random()) * 16;
		if (Math.random() < 0.5) {
			ghost_y *= -1;
		}
		this.pos.x += ghost_x;
		this.pos.y += ghost_y;
	}

	update() {
		if (this.player != null && this.player.alive) {
			var toPlayer = this.player.pos.minus(this.pos);
			var mag = toPlayer.magnitude();
			if (mag < 128) {
				if (!this.showing) {
					this.chainAudio.play();
					this.monsterAudio.play();
					this.showing = true;
					this.wakeTime = this.game.time.time;
				}

				if (mag < 12 && this.game.time.time - this.lastHurtTime > 1000) {
					console.log("hurting player.", this.player);
					var dead = this.player.hurtMe();
					this.lastHurtTime = this.game.time.time;
					this.disappear();
					this.player.main.bloodSplatter(this.player.x, this.player.y);
					if (dead) {
						this.player = null;
					} else {
						this.player.fall();
					}
				}
			}

			if (this.player != null) {
				var vol = 1 - ((mag - 12) / 100);
				this.chainAudio.volume = vol;
				this.monsterAudio.volume = vol;

				if (this.player.pos.x > this.pos.x) {
					this.facing.x = 1;
				} else {
					this.facing.x = -1;
				}
				this.updateFacing();

				if (this.angry) {
					this.pos = this.pos.add(
						toPlayer
						.normalised()
						.times(
							8 * this.game.time.physicsElapsed
						)
					);
				}
			}
		}

		this.alpha = Maths.lerp(this.alpha, 0.25, this.showing ? 1 : 0);
		if (this.showing) {
			if (this.game.time.time - this.wakeTime > this.angryTime) {
				this.angry = true;
			}
		}

		this.x = Math.round(this.pos.x);
		this.y = Math.round(this.pos.y);
	}
}

export default Ghost;
