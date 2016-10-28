import 'pixi';
import 'p2';
import "phaser";

import Vector from '../Helpers/Vector';

class Player extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, 'man_healthy');
		game.world.add(this);
		this.anchor.set(0.5, 1);
		this.facing = new Vector(1, 0);
		this.idealWidth = (this.game.cache.getImage(this.key).width);
		this.updateFacing();
		this.pos = new Vector(x, y);
		this.depth = 0;
		this.stepCounter = 0;
		this.stepKey = 1;
		this.stepWait = 0.3;
		this.ouchCounter = 1;
		this.walkKey = 1;
		this.fallWaitTime = 1000;
		this.animWait = 0.15;
		this.animCounter = 0;
		this.hurt = false;

		this.leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
		this.upKey = this.game.input.keyboard.addKey(Phaser.KeyCode.UP);
		this.downKey = this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);

		this._state = this.walk.bind(this);
		this.getUpTime = this.game.time.time;
	}

	updateFacing() {
		this.width = this.idealWidth * this.facing.x;
	}

	fall() {
		this.ouchCounter++;
		if (this.ouchCounter > 4) {
			this.ouchCounter = 1;
		}
		console.log("ouch!");
		this.game.add.audio('ouch' + this.ouchCounter.toString()).play();
		this.game.add.audio('slam').play();

		this.loadTexture('man' + (this.hurt ? '_injured' : '_healthy') + '_fall');
		this.idealWidth = (this.game.cache.getImage(this.key).width);
		this.fallTime = this.game.time.time;
		this._state = this.fallen.bind(this);
		this.fallWaitTime = 2000 + Math.random() * 2000;
	}

	hurtMe() {
		if (!this.hurt) {
			this.hurt = true;
			return false;
		} else {
			this.game.winGameYes = false;
			this.game.state.start('end');
			this.destroy();
			return true;
		}
	}

	step() {
		this.stepCounter = 0;
		this.stepKey++;
		if (this.stepKey > 6) {
			this.stepKey = 1;
		}

		this.game.add.audio('steps' + this.stepKey.toString(), 0.25).play();
	}

	fallen() {
		if (this.game.time.time - this.fallTime > 2000) {
			this.stand();
		}
	}

	stand() {
		this._state = this.walk.bind(this);
		this.loadTexture('man' + (this.hurt ? '_injured' : '_healthy'));
		this.idealWidth = (this.game.cache.getImage(this.key).width);
		this.getUpTime = this.game.time.time;
	}

	update() {
		this._state();

		this.x = Math.round(this.pos.x);
		this.y = Math.round(this.pos.y);
	}

	updateSteps() {
		this.stepCounter += this.game.time.physicsElapsed;
		this.animCounter += this.game.time.physicsElapsed;
		if (this.animCounter > this.animWait) {
			this.walkKey = this.walkKey == 1 ? 2 : 1;
			this.loadTexture(
				'man' + 
				(this.hurt ? '_injured' : '_healthy') + 
				'_walk_'+
				this.walkKey.toString()
			);
			this.idealWidth = (this.game.cache.getImage(this.key).width);
			this.animCounter -= this.animWait;
		}

		if (this.stepCounter > this.stepWait) {
			this.step();
			if (this.hurt && Math.random() < 0.8) {
				this.main.bloodSplatter(this.pos.x, this.pos.y);
			}
		}
	}

	walk() {
		var move = new Vector(0, 0);
		if (this.leftKey.isDown) {
			move.x--;
		}
		if (this.rightKey.isDown) {
			move.x++;
		}
		if (this.upKey.isDown) {
			move.y--;
		}
		if (this.downKey.isDown) {
			move.y++;
		}

		if (move.x != 0) {
			this.facing.x = move.x;
		}
		this.updateFacing();

		var nextPos = this.pos.add(
			move
			.normalised()
			.times(
				this.game.time.physicsElapsed * (this.hurt ? 15 : 20)
			)
		);

		var square_x = Math.floor(nextPos.x / 16);
		var square_y = Math.floor(nextPos.y / 16);

		if (this.squares[square_x][square_y] == null) {
			this.pos = nextPos;

			if (move.x != 0 || move.y != 0) {
				this.updateSteps();
			} else {
				this.loadTexture('man' + (this.hurt ? '_injured' : '_healthy'));
				this.idealWidth = (this.game.cache.getImage(this.key).width);
			}

			if (this.game.time.time - this.getUpTime > this.fallWaitTime) {
				this.fall();
			}
		} else if (this.squares[square_x][square_y].door) {
			this.game.winGameYes = true;
			this.game.state.start('end');
		} else if (this.squares[square_x][square_y].torch != null) {
			this.squares[square_x][square_y].torch.destroy();
			this.squares[square_x][square_y].torch = null;
			this.squares[square_x][square_y] = null;
			this.main.boostTorch();
		}
	}
}

export default Player;
