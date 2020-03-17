// chess.js

class BaseClass {
	#left = 0
	#right = 0
	#top = 0
	#bottom = 0
	#cx = 0
	#cy = 0
	#width = 0 
	#height = 0

	set width(w) {
		this.#width = w;
	}

	get width() {
		return this.#width;
	}

	set height(h) {
		this.#height = h;
	}

	get height() {
		return this.#height;
	}

	set left(l) {
		this.#left = l;
	}

	get left() {
		return this.#left;
	}

	set right(r) {
		this.#right = r;
	}

	get right() {
		return this.#right;
	}

	set top(t) {
		this.#top = t;
	}

	get top() {
		return this.#top;
	}

	set bottom(b) {
		this.#bottom = b;
	}

	get bottom() {
		return this.#bottom;
	}

	set cx(x) {
		this.#cx = x;
	}

	get cx() {
		return this.#cx;
	}

	set cy(y) {
		this.#cy = y;
	}

	get cy() {
		return this.#cy;
	}

	constructor(left, top, width, height) {
		this.left = left;
		this.right = left + width;
		this.top = top;
		this.bottom = top + height;
		this.cx = left + width / 2;
		this.cy = top + height / 2;
		this.width = width;
		this.height = height;
	}
}

function DrawImage(context, imageSrc, left, top, width, height) {
	var image = new Image();
	image.onload = function() {
		context.drawImage(image, left, top, width, height);
	};
	image.src = imageSrc;
}

class Sprite extends BaseClass {
	#isLoaded = false
	#src = ''
	#image = null

	constructor(src, left, top, width, height) {
		super(left, top, width, height);
		this.#src = src;
		this.load_image();
	}

	load_image() {
		this.#image = new Image();
		this.#image.onload = () => { this.#isLoaded = true; };
		this.#image.src = this.#src;
	}

	draw(ctx) {
		if (this.#isLoaded) {
			ctx.drawImage(this.#image, this.left, this.top, this.width, this.height);
		}
	}
}

class Text {
	#string = ''
	#cx = 0
	#cy = 0
	#font = ''

	get string() {
		return this.#string;
	}

	set string(value) {
		this.#string = value;
	}

	constructor(string, cx, cy, font='20px Arial') {
		this.#cx = cx;
		this.#cy = cy;
		this.#string = string;
		this.#font = font;
	}

	draw(ctx) {
		ctx.font = this.#font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.#string, this.#cx, this.#cy);
	}
}

class Rect extends BaseClass {
	#color = '#FF0000'

	constructor(left, top, width, height, color) {
		super(left, top, width, height);
		this.#color = color;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.#color;
		ctx.rect(this.left, this.top, this.width, this.height);
		ctx.stroke();
	}
}

const EventTypes = {
	MOUSE_DOWN : 'mouse_down',
	MOUSE_UP   : 'mouse_up'
}

let Delegates = {
	'mouse_down' : [],
	'mouse_up'   : [] 
}

class EventSystem {
	#canvasLeft = 0
	#canvasTop = 0 
	#delegates = {}
	#keys = []

	wire_events(canvas) {
		var rect = canvas.getBoundingClientRect();
		this.#canvasLeft = rect.left;
		this.#canvasTop = rect.top;
		canvas.onmousedown = (mouseEventArgs) => this.onMouseDown(mouseEventArgs);
		canvas.onmouseup = (mouseEventArgs) => this.onMouseUp(mouseEventArgs);
	}

	add_listener(eventType, func) {
		Delegates[eventType].push(func);
	}

	callAllDelegateOfType(eventType, eventArgs) {
		for (var func of Delegates[eventType]) {
			func(eventArgs);
		}
	}

	onMouseDown(mouseEventArgs) {
		this.convertScreenToCanvasPoint(mouseEventArgs);
		this.callAllDelegateOfType(EventTypes.MOUSE_DOWN, mouseEventArgs);
	}

	onMouseUp(mouseEventArgs) {
		this.convertScreenToCanvasPoint(mouseEventArgs);
		this.callAllDelegateOfType(EventTypes.MOUSE_UP, mouseEventArgs);
	}

	convertScreenToCanvasPoint(eventArgs) {
		eventArgs.canvasX = eventArgs.clientX - this.#canvasLeft;
		eventArgs.canvasY = eventArgs.clientY - this.#canvasTop;
	}
}

let events = new EventSystem();

const ChessInfo = {
	SPRITE_FOLDER     : 'sprites',
	SPRITE_POSTFIX    : '_2x_ns.png',
	CHESSBOARD_ROWS   : 8,
	CHESSBOARD_COLS   : 8,
	DEFAULT_TILE_SIZE : 75
}

const ChessPieceType = {
	BLACK : {
		KING   : 'b_king',
		QUEEN  : 'b_queen',
		BISHOP : 'b_bishop',
		KNIGHT : 'b_knight',
		ROOK   : 'b_rook',
		PAWN   : 'b_pawn'
	},
	WHITE : {
		KING   : 'w_king',
		QUEEN  : 'w_queen',
		BISHOP : 'w_bishop',
		KNIGHT : 'w_knight',
		ROOK   : 'w_rook',
		PAWN   : 'w_pawn'
	},
	NONE : 'none'
}

const ChessStartPosition = {
	0  : ChessPieceType.BLACK.ROOK, 
	1  : ChessPieceType.BLACK.KNIGHT,
	2  : ChessPieceType.BLACK.BISHOP,
	3  : ChessPieceType.BLACK.QUEEN,
	4  : ChessPieceType.BLACK.KING, 
	5  : ChessPieceType.BLACK.BISHOP,
	6  : ChessPieceType.BLACK.KNIGHT,
	7  : ChessPieceType.BLACK.ROOK,
	8  : ChessPieceType.BLACK.PAWN, 
	9  : ChessPieceType.BLACK.PAWN, 
	10 : ChessPieceType.BLACK.PAWN, 
	11 : ChessPieceType.BLACK.PAWN, 
	12 : ChessPieceType.BLACK.PAWN,
	13 : ChessPieceType.BLACK.PAWN,
	14 : ChessPieceType.BLACK.PAWN,
	15 : ChessPieceType.BLACK.PAWN,

	48 : ChessPieceType.WHITE.PAWN,
	49 : ChessPieceType.WHITE.PAWN,
	50 : ChessPieceType.WHITE.PAWN,
	51 : ChessPieceType.WHITE.PAWN,
	52 : ChessPieceType.WHITE.PAWN,
	53 : ChessPieceType.WHITE.PAWN,
	54 : ChessPieceType.WHITE.PAWN,
	55 : ChessPieceType.WHITE.PAWN,
	56 : ChessPieceType.WHITE.ROOK, 
	57 : ChessPieceType.WHITE.KNIGHT, 
	58 : ChessPieceType.WHITE.BISHOP,
	59 : ChessPieceType.WHITE.QUEEN,
	60 : ChessPieceType.WHITE.KING,
	61 : ChessPieceType.WHITE.BISHOP,
	62 : ChessPieceType.WHITE.KNIGHT, 
	63 : ChessPieceType.WHITE.ROOK
}

class ChessPiece extends Sprite {
	#pieceType = ChessPieceType.NONE
	#size = 0
	#tile_index = -1

	get index() {
		return this.#tile_index;
	}

	set index(i) {
		this.#tile_index = i;
	}

	static getSrc(pieceType) {
		return `${ChessInfo.SPRITE_FOLDER}/${pieceType}${ChessInfo.SPRITE_POSTFIX}`;
	}

	constructor(x, y, size, pieceType, index) {
		super(ChessPiece.getSrc(pieceType), x - size / 2, y - size / 2, size, size);
		this.#size = size;
		this.#pieceType = pieceType;
		this.index = index;
	}
}

const TileType = {
	LIGHT : 'light',
	DARK  : 'dark',
	NONE  : 'none'
}

class ChessTile extends Sprite {
	#size = 0
	#type = TileType.NONE
	#text = null
	#isDebug = true;
	#isSelected = false;
	#selection_border = null

	static getSrc(type) {
		var spriteFolder = ChessInfo.SPRITE_FOLDER;
		var spritePostfix = ChessInfo.SPRITE_POSTFIX;
		switch (type) {
			case TileType.LIGHT:
				return `${spriteFolder}/square brown light${spritePostfix}`;
			case TileType.DARK:
				return `${spriteFolder}/square brown dark${spritePostfix}`;
			default:
				console.log('The tile cannot have a type of NONE.');
				return null;
		}
	}

	constructor(left, top, size, type, isDebug=true) {
		super(ChessTile.getSrc(type), left + 1, top + 1, size, size);
		this.#size = size;
		this.#type = type;
		this.#isDebug = isDebug;
		this.#selection_border = new Rect(this.left - 1, this.top - 1, this.width + 2, this.height + 2, '#FF0000')
		var index = (this.left + this.top * ChessInfo.CHESSBOARD_COLS) / this.#size
		var index_str = `${index.toFixed()}`;
		this.#text = new Text(index_str, this.left + this.#size / 2, this.top + this.#size / 2);
	}

	bounds(x, y) {
		return (Math.pow((x - this.cx), 2) <= Math.pow((this.width / 2), 2) && 
				Math.pow((y - this.cy), 2) <= Math.pow((this.height / 2), 2));
	}

	select() {
		this.#isSelected = !this.#isSelected;
	}

	draw(ctx) {
		super.draw(ctx);
		if (this.#isSelected) {
			this.#selection_border.draw(ctx)
		}
		if (this.#isDebug) {
			this.#text.draw(ctx);
		}
	}
}

class Chessboard {
	#board = []
	#pieces = []
	#tileSize = 0
	#selectedTile = null

	constructor(tileSize) {
		this.#tileSize = tileSize;
		this.generate();
		this.wire_events();
	}

	wire_events() {
		events.add_listener(EventTypes.MOUSE_DOWN, (mouseEventArgs) => this.onMouseDown(mouseEventArgs));
	}

	generate() {
		this.generateTiles();
		this.generatePieces();
	}

	generateTiles() {
		for (let i = 0; i < ChessInfo.CHESSBOARD_ROWS; i++) {
			for (let j = 0; j < ChessInfo.CHESSBOARD_COLS; j++) {
				var left = j * this.#tileSize;
				var top = i * this.#tileSize;
				var tileType = (i + j) % 2 == 0 ? TileType.LIGHT : TileType.DARK;
				var chessTile = new ChessTile(left, top, this.#tileSize, tileType);
				this.#board.push(chessTile);
			}
		}
	}

	generatePieces() {
		for (var index in ChessStartPosition) {
			var tile = this.#board[index];
			var pieceType = ChessStartPosition[index];
			var chessPiece = new ChessPiece(tile.cx, tile.cy, this.#tileSize-20, pieceType, index);
			this.#pieces.push(chessPiece);
		}
	}

	draw(ctx) {
		for (var tile of this.#board) {
			if (this.#selectedTile != tile) {
				tile.draw(ctx);
			}
		}
		if (this.#selectedTile != null) {
			this.#selectedTile.draw(ctx);
		}
		for (var piece of this.#pieces) {
			piece.draw(ctx);
		}
	}

	onMouseDown(mouseEventArgs) {
		if (this.#selectedTile != null) {
			this.#selectedTile.select();
			if (this.#selectedTile.bounds(mouseEventArgs.canvasX, mouseEventArgs.canvasY)) {
				this.#selectedTile = null;
				return;
			}
			this.#selectedTile = null;
		}

		for (var tile of this.#board) {
			if (tile.bounds(mouseEventArgs.canvasX, mouseEventArgs.canvasY)) {
				tile.select();
				this.#selectedTile = tile;
				break;
			}
		}
	}
}

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
	events.wire_events(canvas);
	canvasSize = ChessInfo.CHESSBOARD_ROWS * ChessInfo.DEFAULT_TILE_SIZE + 2; //Add 2 for selection border
	ctx.canvas.width = canvasSize;
	ctx.canvas.height = canvasSize;
	var runtime = new Runtime(ctx, ChessInfo.DEFAULT_TILE_SIZE);
	runtime.run();
};

