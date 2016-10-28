import 'pixi';
import 'p2';
import "phaser";

import Maths from '../Helpers/Maths';
import Vector from '../Helpers/Vector';
import Player from '../Entities/Player';
import Ghost from '../Entities/Ghost';
import Square from '../Entities/Square';
import Torch from '../Entities/Torch';

import _ from 'underscore';

class Main extends Phaser.State {
	create() {
		console.log("main");

		this.squares = [];
		this.torches = 20;
		this.slotTargetWidth = 1024;
		this.slotAdd = 256;

		this.game.winGameYes = true;

		this.bloodGroup = this.add.group();
		this.gameGroup = this.add.group();
		this.slotGroup = this.add.group();
		this.noiseGroup = this.add.group();

		for (var x = 0; x < this.game.width / 16; x++) {
			this.squares.push([]);
			for (var y = 0; y < this.game.height / 16; y++) {
				var square = new Square(this.game, x*16, y*16, new Vector(x, y));
				square.main = this;
				this.squares[x].push(square);
				this.gameGroup.add(square);
			}
		}

		this.musicAudio = this.add.audio('music', 1, true);
		this.musicAudio.play();

		console.log(this.squares);

		var startpositions = [
			[4, 4],
			[4, this.squares[0].length - 4],
			[this.squares.length - 4, this.squares[0].length - 4],
			[this.squares.length - 4, 4]
		];

		var directions = [
			new Vector(-1, -1),
			new Vector(1, -1),
			new Vector(1, 1),
			new Vector(-1, 1),
			new Vector(-1, -1),
			new Vector(1, -1),
			new Vector(1, 1),
			new Vector(-1, 1)
		];

		var mid = new Vector(
			this.game.width * 0.5,
			this.game.height * 0.5
		);

		var furthestSquare = new Vector(0, 0);
		var longestDistance = 0;

		var time = 0;
		for (var j = 0; j < directions.length; j++) {
			var x = Math.floor(this.squares.length * 0.5);
			var y = Math.floor(this.squares[0].length * 0.5);
			for (var i = 0; i < 100; i++) {
				var move = new Vector(0, 0);
				if (Math.random() < 0.5) {
					move.x += Math.round((Math.random() - 0.5) * 2);
					move.x += directions[j].x * Math.random();
					move.x = Math.round(move.x);
					move.x = Maths.clamp(move.x, -1, 1);
				} else {
					move.y += Math.round((Math.random() - 0.5) * 2);
					move.y += directions[j].y * Math.random();
					move.y = Math.round(move.y);
					move.y = Maths.clamp(move.y, -1, 1);
				}

				if (!this.squares[x][y].killme) {
					var distance = new Vector(x, y).distance(mid);
					if (distance > longestDistance) {
						longestDistance = distance;
						furthestSquare = new Vector(x, y);
					} else if (Math.abs(distance - longestDistance) < 16) {
						if (Math.random() < 0.5) {
							longestDistance = distance;
							furthestSquare = new Vector(x, y);
						}
					}
					this.squares[x][y].destroyme(time);
				}

				x += move.x;
				y += move.y;

				x = Maths.clamp(x, 0, this.squares.length - 1);
				y = Maths.clamp(y, 0, this.squares[0].length - 1);

				time += 10;
			}
		}

		var door = this.add.sprite(furthestSquare.x*16, furthestSquare.y*16, 'door');
		this.gameGroup.add(door);
		this.squares[furthestSquare.x][furthestSquare.y] = {door: true};

		this.player = new Player(this.game, this.game.width*0.5, this.game.height*0.5);
		this.player.main = this;
		this.slot = this.add.sprite(0, 0, 'slot');
		this.slot.anchor.set(0.5, 0.5);
		this.slot.tint = 0x000000;
		this.slot.alpha = 1;
		this.slot.width *= 1;
		this.slot.height *= 1;
		this.slotGroup.add(this.slot);
		this.player.squares = this.squares;
		this.player.main = this;
		this.gameGroup.add(this.player);

		var ghost_x = 24 + (Math.random()) * 16;
		if (Math.random() < 0.5) {
			ghost_x *= -1;
		}
		var ghost_y = 24 + (Math.random()) * 16;
		if (Math.random() < 0.5) {
			ghost_y *= -1;
		}

		var ghost = new Ghost(
			this.game, 
			this.player.x + ghost_x,
			this.player.pos.y + ghost_y
		);
		ghost.player = this.player;
		this.gameGroup.add(ghost);

		var content = document.getElementById('content');
		document.getElementById('static').width = content.clientWidth;
		document.getElementById('static').height = content.clientHeight;
	}

	killSquare(x, y) {
		if (this.squares[x][y] != null && !this.squares[x][y].door) {
			this.squares[x][y].destroy();
			this.squares[x][y] = null;

			if (Math.random() < 0.1 && this.torches > 0) {
				var torch = new Torch(this.game, x*16+8, y*16+8);
				this.gameGroup.add(torch);
				this.squares[x][y] = {torch};
				this.torches--;
				this.slot.bringToTop();
			}
		}
	}

	bloodSplatter(x, y) {
		var blood = this.add.sprite(x, y, 'blood' + (1 + Math.floor(Math.random() * 3)).toString());
		blood.anchor.set(0.5, 0.5);
		this.bloodGroup.add(blood);
		blood.update = function() {
			this.alpha -= this.game.time.physicsElapsed * 0.01;
			if (this.alpha <= 0) {
				this.destroy();
			}
		}.bind(blood);
	}

	update() {
		this.gameGroup.sort('y', Phaser.Group.SORT_ASCENDING);
		this.slot.x = this.player.x;
		this.slot.y = this.player.y;
		this.slot.width = Maths.lerp(this.slot.width, 0.15, this.slotTargetWidth);
		this.slot.height = this.slot.width;
	}

	boostTorch() {
		this.slotTargetWidth += this.slotAdd;
		console.log("boost torch!!!");
	}
}

export default Main;
