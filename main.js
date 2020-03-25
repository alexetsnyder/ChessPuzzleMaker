//main.js
import { Events } from './modules/events.mjs';
import { ChessController, GetCanvasSize } from './modules/ChessController.mjs';

class Runtime { 
	#isRunning = false
	#ctx = null
	#chessController = null

	constructor(ctx) {
		this.#ctx = ctx;
		this.#chessController = new ChessController();
		this.#isRunning = true;
	}

	clear() {
		this.#ctx.fillStyle = 'black';
		this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
	}

	update() {

	}

	draw() {
		this.clear();
		this.#chessController.draw(this.#ctx);
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
	var canvas = document.getElementById('cnvChessboard');
	var ctx = canvas.getContext('2d');
	Events.wire_events(canvas);
	var canvasSize = GetCanvasSize();
	ctx.canvas.width = canvasSize.width;
	ctx.canvas.height = canvasSize.height;
	var runtime = new Runtime(ctx);
	runtime.run();
}

window.onload = main;