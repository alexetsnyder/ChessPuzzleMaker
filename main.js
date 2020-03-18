//main.js
import { Events } from './modules/events.mjs';
import { Chessboard, ChessInfo } from './modules/chess.mjs';

class Runtime { 
	#isRunning = false
	#ctx = null
	#tileSize = 0
	#chessboard = null

	constructor(ctx, tileSize) {
		this.#ctx = ctx;
		this.#tileSize = tileSize;
		this.#chessboard = new Chessboard(tileSize);
		this.#isRunning = true;
	}

	update() {

	}

	draw() {
		this.#ctx.fillStyle = 'black';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		this.#chessboard.draw(this.#ctx);
	}

	run() {
		if (this.#isRunning) { 
			this.update();
			this.draw();
			window.requestAnimationFrame(() => { this.run(); });
		}
	}
}

function main() {
	var canvas = document.getElementById('chessboard');
	var ctx = canvas.getContext('2d');
	Events.wire_events(canvas);
	var canvasSize = ChessInfo.CHESSBOARD_ROWS * ChessInfo.DEFAULT_TILE_SIZE + 2; //Add 2 for selection border
	ctx.canvas.width = canvasSize;
	ctx.canvas.height = canvasSize;
	var runtime = new Runtime(ctx, ChessInfo.DEFAULT_TILE_SIZE);
	runtime.run();
}

window.onload = main;