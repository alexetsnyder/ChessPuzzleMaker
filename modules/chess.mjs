//chess.mjs
import { Events, EventTypes } from './events.mjs';
import { Rect, Text, Sprite } from './drawing.mjs';

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

	place(tile) {
		this.index = tile.index;
		this.setPos(tile.cx - this.#size / 2, tile.cy - this.#size / 2);
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
	#index = -1
	#isDebug = true;
	#isSelected = false;
	#selection_border = null

	get index() {
		return this.#index;
	}

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

	constructor(left, top, size, type, index, isDebug=true) {
		super(ChessTile.getSrc(type), left + 1, top + 1, size, size);
		this.#size = size;
		this.#type = type;
		this.#index = index;
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
		this.#isSelected = true;
	}

	unselect() {
		this.#isSelected = false;
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
	#selectedPiece = null

	constructor(tileSize) {
		this.#tileSize = tileSize;
		this.generate();
		this.wire_events();
	}

	wire_events() {
		Events.add_listener(EventTypes.MOUSE_DOWN, (mouseEventArgs) => this.onMouseDown(mouseEventArgs));
		document.getElementById('btnReset').onclick = (btnEventArgs) => this.onResetClick(btnEventArgs);
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
				var chessTile = new ChessTile(left, top, this.#tileSize, tileType, j + i * ChessInfo.CHESSBOARD_COLS);
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

	reset() {
		if (this.#selectedTile != null) {
			this.#selectedTile.unselect();
			this.#selectedTile = null;
		}
		if (this.#selectedPiece != null) {
			this.#selectedPiece = null;
		}
		this.#pieces.length = 0;
		this.generatePieces();
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

	getPiece(tile) {
		var new_piece = null;
		for (var piece of this.#pieces) {
			if (piece.index == tile.index) {
				new_piece = piece;
				break;
			}
		}
		return new_piece;
	}

	onResetClick(btnEventArgs) {
		this.reset();
	}

	onMouseDown(mouseEventArgs) {
		var currentTile = this.#selectedTile;
		for (var tile of this.#board) {
			if (tile.bounds(mouseEventArgs.canvasX, mouseEventArgs.canvasY)) {
				this.#selectedTile = tile;
				break;
			}
		}

		if (this.#selectedTile == currentTile) {
			this.#selectedTile.unselect();
			this.#selectedPiece = null;
			this.#selectedTile = null;
		}
		else {
			if (currentTile != null) {
				currentTile.unselect();
			}
			this.#selectedTile.select();
			var currentPiece = this.#selectedPiece;
			var tile = this.#selectedTile;
			this.#selectedPiece = this.getPiece(tile);
			if (this.#selectedPiece == null && currentPiece != null) {
				currentPiece.place(tile);
				this.#selectedPiece = currentPiece;
			}
			
		}
	}
}

export { ChessInfo, Chessboard };