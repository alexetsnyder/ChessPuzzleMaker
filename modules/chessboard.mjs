//chess.mjs

import { Sprite, Rect, Text, Point } from './drawing.mjs';

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

function GetPieceSource(pieceType) {
	return `${ChessInfo.SPRITE_FOLDER}/${pieceType}${ChessInfo.SPRITE_POSTFIX}`;
}

function GetPieceSize(pieceType, tileSize) {
	var pieceSize = 0;
	switch (pieceType) {
		case ChessPieceType.BLACK.PAWN:
		case ChessPieceType.WHITE.PAWN:
		case ChessPieceType.BLACK.ROOK:
		case ChessPieceType.WHITE.ROOK:
			pieceSize = tileSize.width - 20;
			break;
		default:
			pieceSize = tileSize.width - 10;
			break;
	}
	return new Point(pieceSize, pieceSize);
}

class ChessPiece extends Sprite {
	#type = ChessPieceType.NONE;

	constructor(type, center, tileSize) {
		var pieceSrc = GetPieceSource(type);
		var pieceSize = GetPieceSize(type, tileSize);
		var leftTop = new Point(center.x - pieceSize.width / 2, center.y - pieceSize.height / 2);
		super(pieceSrc, leftTop, pieceSize); 
		this.#type = type;
	}

	put(tileCenter) {
		var pieceLeftTop = new Point(tileCenter.x - this.width / 2, tileCenter.y - this.height / 2);
		this.setPos(pieceLeftTop);
	}
}

const TileType = {
	LIGHT : 'light',
	DARK  : 'dark',
	NONE  : 'none'
}

function GetTileSource(tileType) {
	var tileStr = '';
	switch (tileType) {
			case TileType.LIGHT:
				tileStr = 'square brown light';
				break;
			case TileType.DARK:
				tileStr = 'square brown dark';
				break;
			default:
				console.log('The tile cannot have a type of NONE.');
				return null;
	}
	return `${ChessInfo.SPRITE_FOLDER}/${tileStr + ChessInfo.SPRITE_POSTFIX}`;
}

class ChessTile extends Sprite {
	#text = null
	#index = 0
	#type = TileType.NONE
	#isSelected = false;
	#selection_border = null
	#showIndex = false

	get index() {
		return this.#index;
	}

	constructor(leftTop, size, type, index) {
		var tileSrc = GetTileSource(type);
		var tilePoint = new Point(leftTop.x + 1, leftTop.y + 1);
		super(tileSrc, tilePoint, size);
		this.#type = type;
		this.#index = index;
		var borderSize = new Point(this.width + 2, this.height + 2);
		var borderPoint = new Point(this.left - 1, this.top -1);
		this.#selection_border = new Rect(borderPoint, borderSize, '#FF0000')
		this.#text = new Text(`${index}`, this.center);
	}

	bounds(point) {
		return (Math.pow((point.x - this.cx), 2) <= Math.pow((this.width / 2), 2) && 
				Math.pow((point.y - this.cy), 2) <= Math.pow((this.height / 2), 2));
	}

	showIndex() {
		this.#showIndex = !this.#showIndex;
	}

	select() {
		this.#isSelected = true;
	}

	unselect() {
		this.#isSelected = false;
	}

	draw(ctx) {
		super.draw(ctx);
		if (this.#showIndex) {
			this.#text.draw(ctx);
		}
		if (this.#isSelected) {
			this.#selection_border.draw(ctx)
		}
	}
}

class Chessboard {
	#board = []
	#tileSize = null
	#coordinates = []
	#selectedTile = null
	#clickedTile = null

	get selectedTile() {
		return this.#selectedTile;
	}

	get clickedTile() {
		return this.#clickedTile;
	}

	constructor(tileSize) {
		this.#tileSize = tileSize;
		this.generateTiles();
		this.generateCoordinates();
	}

	generateTiles() {
		for (let i = 0; i < ChessInfo.CHESSBOARD_ROWS; i++) {
			for (let j = 0; j < ChessInfo.CHESSBOARD_COLS; j++) {
				var leftTop = new Point(j * this.#tileSize.width + 2, i * this.#tileSize.height + 2);
				var tileType = (i + j) % 2 == 0 ? TileType.LIGHT : TileType.DARK;
				var chessTile = new ChessTile(leftTop, this.#tileSize, tileType, j + i * ChessInfo.CHESSBOARD_COLS);
				this.#board.push(chessTile);
			}
		}
	}

	generateCoordinates() {
		for (let i = ChessInfo.CHESSBOARD_ROWS; i > 0; i--) {
			var tile = this.#board[-(i - ChessInfo.CHESSBOARD_ROWS) * ChessInfo.CHESSBOARD_COLS];
			var textCenter = new Point(tile.left + 10, tile.top + 15);
			var text = new Text(`${i}`, textCenter);
			this.#coordinates.push(text);
		}
		var alpha = 'abcdefgh';
		for (let j = 0; j < ChessInfo.CHESSBOARD_COLS; j++) {
			var tile = this.#board[ChessInfo.CHESSBOARD_COLS * (ChessInfo.CHESSBOARD_ROWS - 1) + j];
			var textCenter = new Point(tile.right - 10, tile.bottom - 12);
			var text = new Text(alpha.slice(j, j+1), textCenter);
			this.#coordinates.push(text);
		}
	}

	showGrid() {
		for (var tile of this.#board) {
			tile.showIndex();
		}
	}

	unselect() {
		if (this.#selectedTile != null) {
			this.#selectedTile.unselect();
			this.#selectedTile = null;
		}
	}

	getTileCenter(index) {
		return this.#board[index].center;
	}

	getTileAt(point) {
		for (var tile of this.#board) {
			if (tile.bounds(point)) {
				return tile;
			}
		}
		return null;
	}

	selectTileAt(point) {
		var tile = this.getTileAt(point);
		if (tile != null) {
			this.unselect();
			this.#clickedTile = tile;
			this.#selectedTile = tile;
			this.#selectedTile.select();
			return true;
		}
		return false;
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
		for (var text of this.#coordinates) {
			text.draw(ctx);
		}
	}
}

export { Chessboard, ChessPiece, ChessInfo, ChessPieceType, GetPieceSize };

