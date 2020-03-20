//chess_rules.mjs

import { Sprite, Rect, Text } from './drawing.mjs';
import { Events, EventTypes } from './events.mjs';

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
	switch (pieceType) {
		case ChessPieceType.BLACK.PAWN:
		case ChessPieceType.WHITE.PAWN:
		case ChessPieceType.BLACK.ROOK:
		case ChessPieceType.WHITE.ROOK:
			return tileSize - 20;
		default:
			return tileSize - 10;
	}
}

class ChessPiece extends Sprite {
	#tile = null
	#size = 0 
	#type = ChessPieceType.NONE;

	get tile() {
		return this.#tile;
	}

	set tile(val) {
		this.#tile = val;
	}

	get size() {
		return this.#size;
	}

	constructor(tile, type) {
		var pieceSrc = GetPieceSource(type);
		var pieceSize = GetPieceSize(type, tile.size);
		super(pieceSrc, tile.cx - pieceSize / 2, tile.cy - pieceSize / 2, pieceSize, pieceSize); 
		this.#tile = tile;
		this.#tile.piece = this;
		this.#size = pieceSize;
		this.#type = type;
	}

	place(newTile) {
		if (this.tile != null) {
			this.tile.piece = null;
		}
		this.tile = newTile;
		this.setPos(this.tile.cx - this.#size / 2, this.tile.cy - this.#size / 2);
		this.tile.piece = this;
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
	#size = 0
	#text = null
	#piece = null
	#index = 0
	#type = TileType.NONE
	#isSelected = false;
	#selection_border = null
	#showIndex = false

	get piece() {
		return this.#piece;
	}

	set piece(val) {
		this.#piece = val;
	}

	get size() {
		return this.#size;
	}

	constructor(left, top, size, type, index) {
		var tileSrc = GetTileSource(type);
		super(tileSrc, left + 1, top + 1, size, size);
		this.#size = size;
		this.#type = type;
		this.#index = index;
		this.#selection_border = new Rect(this.left - 1, this.top - 1, this.width + 2, this.height + 2, '#FF0000')
		this.#text = new Text(`${index}`, this.cx, this.cy);
		document.getElementById('btnShowGrid').addEventListener('click', (btnEventArgs) => this.onShowGridClick(btnEventArgs));
	}

	bounds(x, y) {
		return (Math.pow((x - this.cx), 2) <= Math.pow((this.width / 2), 2) && 
				Math.pow((y - this.cy), 2) <= Math.pow((this.height / 2), 2));
	}

	clear() {
		this.unselect();
		this.#piece = null;
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

	onShowGridClick(btnEventArgs) {
		this.#showIndex = !this.#showIndex;
		if (this.#showIndex) {
			document.getElementById('btnShowGrid').textContent = 'Hide Grid';
		}
		else {
			document.getElementById('btnShowGrid').textContent = 'Show Grid';
		}
	}
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

const ChessPieceColor = {
	WHITE : 'w_',
	BLACK : 'b_',
	NONE  : 'none'
}

class Chessboard {
	#board = []
	#pieces = []
	#tileSize = 0
	#isDragging = false
	#isClickedOnce = false;
	#coordinates = []
	#selectedTile = null
	#clickedTile = null
	#prefabColor = ChessPieceColor.WHITE;
	#prefabPieces = ChessPieceType.WHITE;

	constructor(tileSize) {
		this.#tileSize = tileSize;
		this.generateTiles();
		this.generateCoordinates();
		this.generatePrefabs();
		this.wire_events();
	}

	wire_events() {
		Events.add_listener(EventTypes.MOUSE_DOWN, (mouseEventArgs) => this.onMouseButtonDown(mouseEventArgs));
		Events.add_listener(EventTypes.MOUSE_UP, (mouseEventArgs) => this.onMouseButtonUp(mouseEventArgs));
		Events.add_listener(EventTypes.MOUSE_MOVE, (mouseEventArgs) => this.onMouseMove(mouseEventArgs));
		Events.add_listener(EventTypes.DROP, (dragEventArgs) => this.onDropPiece(dragEventArgs));
		document.getElementById('btnSetUp').onclick = (btnEventArgs) => this.onSetUpClick(btnEventArgs);
		document.getElementById('btnReset').onclick = (btnEventArgs) => this.onResetClick(btnEventArgs);
		document.getElementById('btnClear').onclick = (btnEventArgs) => this.onClearClick(btnEventArgs);
	}

	generateCoordinates() {
		for (let i = ChessInfo.CHESSBOARD_ROWS; i > 0; i--) {
			var tile = this.#board[-(i - ChessInfo.CHESSBOARD_ROWS) * ChessInfo.CHESSBOARD_COLS];
			var text = new Text(`${i}`, tile.left + 10, tile.top + 15);
			this.#coordinates.push(text);
		}
		var alpha = 'abcdefgh';
		for (let j = 0; j < ChessInfo.CHESSBOARD_COLS; j++) {
			var tile = this.#board[ChessInfo.CHESSBOARD_COLS * (ChessInfo.CHESSBOARD_ROWS - 1) + j];
			var text = new Text(alpha.slice(j, j+1), tile.right - 10, tile.bottom - 12);
			this.#coordinates.push(text);
		}
	}

	generateTiles() {
		for (let i = 0; i < ChessInfo.CHESSBOARD_ROWS; i++) {
			for (let j = 0; j < ChessInfo.CHESSBOARD_COLS; j++) {
				var left = j * this.#tileSize + 2;
				var top = i * this.#tileSize + 2;
				var tileType = (i + j) % 2 == 0 ? TileType.LIGHT : TileType.DARK;
				var chessTile = new ChessTile(left, top, this.#tileSize, tileType, j + i * ChessInfo.CHESSBOARD_COLS);
				this.#board.push(chessTile);
			}
		}
	}

	setUpImage(pieceType) {
		var pieceName = this.#prefabPieces[pieceType];
		var pieceSize = GetPieceSize(pieceName, this.#tileSize);
		var altText = pieceName.slice(2).toUpperCase();
		var image = new Image(pieceSize, pieceSize);
		image.src = GetPieceSource(pieceName);
		image.alt = altText;
		image.id = altText;
		image.ondragstart = (dragEventArgs) => this.onDragStart(dragEventArgs);
		return image;
	}

	setUpButton() {
		var div = document.createElement('div');
		var button = document.createElement('button');
		button.textContent = 'BLACK';
		button.style.width = '60px';
		button.style.height = '40px';
		button.style.background = '#000000';
		button.style.color = '#FFFFFF';
		button.style.margin = '0px 0px 5px 0px';
		button.id = 'prefabColor';
		button.onclick = () => this.onChangeColorClick();
		div.appendChild(button);
		return div;
	}

	generatePrefabs() {
		var div = this.setUpButton();
		document.getElementById('prefabDiv').appendChild(div);
		for (var pieceType in this.#prefabPieces) {
			var div = document.createElement('div');
			div.appendChild(this.setUpImage(pieceType));
			document.getElementById('prefabDiv').appendChild(div);
		}
	}

	generatePieces() {
		this.#pieces.length = 0;
		for (var index in ChessStartPosition) {
			var tile = this.#board[index];
			var pieceType = ChessStartPosition[index];
			var chessPiece = new ChessPiece(tile, pieceType);
			this.#pieces.push(chessPiece);
		}
	}

	clear() {
		this.#selectedTile = null;
		for (var tile of this.#board) {
			tile.clear();
		}
		this.#pieces.length = 0;
	}

	reset() {
		this.clear();
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
		for (var text of this.#coordinates) {
			text.draw(ctx);
		}
		for (var piece of this.#pieces) {
			piece.draw(ctx);
		}
	}

	movePiece(sourceTile, destinationTile) {
		var piece = sourceTile.piece;
		if (piece != null && destinationTile.piece == null) {
			piece.place(destinationTile);
			return true;
		}
		return false;
	}

	switchPrefabButton(pieceColor) {
		var button = document.getElementById('prefabColor');
		button.textContent = pieceColor;
		var backColor = button.style.background;
		button.style.background = button.style.color;
		button.style.color = backColor;
	}

	switchPieceColor() {
		for (var pieceType in this.#prefabPieces) {
			var pieceName = this.#prefabPieces[pieceType];
			var prefab = document.getElementById(pieceType);
			prefab.src = GetPieceSource(pieceName);
		}
	}

	onChangeColorClick() {
		if (this.#prefabColor == ChessPieceColor.WHITE) {
			this.#prefabColor = ChessPieceColor.BLACK;
			this.#prefabPieces = ChessPieceType.BLACK;
			this.switchPieceColor();
			this.switchPrefabButton('WHITE');
		}
		else {
			this.#prefabColor = ChessPieceColor.WHITE;
			this.#prefabPieces = ChessPieceType.WHITE;
			this.switchPieceColor();
			this.switchPrefabButton('BLACK');
		}
	}

	onSetUpClick(btnEventArgs) {
		this.generatePieces();
		document.getElementById('btnSetUp').disabled = true;
		document.getElementById('btnClear').disabled = false;
		document.getElementById('btnReset').disabled = false;
	}

	onResetClick(btnEventArgs) {
		this.reset();
	}

	onClearClick(btnEventArgs) {
		this.clear();
		document.getElementById('btnSetUp').disabled = false;
		document.getElementById('btnClear').disabled = true;
		document.getElementById('btnReset').disabled = true;
	}

	onDragStart(dragEventArgs) {
		dragEventArgs.dataTransfer.setData('piece', dragEventArgs.srcElement.alt);
	}

	onDropPiece(dragEventArgs) {
		var pieceType = this.#prefabColor + dragEventArgs.dataTransfer.getData('piece').toLowerCase();
		for (var tile of this.#board) {
			if (tile.bounds(dragEventArgs.canvasX, dragEventArgs.canvasY)) {
				if (tile.piece == null) {
					var piece = new ChessPiece(tile, pieceType);
					this.#pieces.push(piece);
					document.getElementById('btnClear').disabled = false;
				}
			}
		}
	}

	onMouseMove(mouseEventArgs) {
		if (this.#isDragging && this.#clickedTile != null) {
			var piece = this.#clickedTile.piece;
			if (piece != null) {
				var size = piece.size;
				piece.setPos(mouseEventArgs.canvasX - size / 2, mouseEventArgs.canvasY - size / 2);
			}
		}
	}

	onMouseButtonUp(mouseEventArgs) {
		this.#isDragging = false;
		if (this.#clickedTile != null) {
			var selectedPiece = this.#clickedTile.piece;
			if (selectedPiece != null) {
				var nextTile = null;
				for (var tile of this.#board) {
					if (tile.bounds(mouseEventArgs.canvasX, mouseEventArgs.canvasY)) {
						nextTile = tile;
						break;
					}
				}

				if (!this.movePiece(this.#clickedTile, nextTile))
				{
					selectedPiece.place(this.#clickedTile);
				}
				else {
					this.#clickedTile.unselect();
					this.#selectedTile = null;
				}
			}
		}
	}

	onMouseButtonDown(mouseEventArgs) {
		this.#isDragging = true;
		var previousTile = this.#selectedTile;
		for (var tile of this.#board) {
			if (tile.bounds(mouseEventArgs.canvasX, mouseEventArgs.canvasY)) {
				this.#clickedTile = tile;
				this.#selectedTile = tile;
				this.#selectedTile.select();
				if (previousTile != null) {
					if (previousTile != this.#selectedTile) {
						previousTile.unselect();
						this.movePiece(previousTile, this.#selectedTile);
					}
					else {
						this.#selectedTile.unselect();
						this.#selectedTile = null;
					}
				}
				break;
			}
		}	
	}
}

class Vector {
	#x = 0
	#y = 0

	get x() {
		return this.#x;
	}

	set x(val) {
		this.#x = val;
	}

	get y() {
		return this.#y;
	}

	set y(val) {
		this.#y = val;
	}

	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}

	minus(v2) {
		return new Vector(this.x - v2.x, this.y - v2.y);
	}
}

const Turn = {
	WHITE : 'white',
	BLACK : 'black',
	NONE  : 'none'
}

class ChessGame {
	#turn = Turn.NONE;

	constructor() {
		this.#turn = Turn.WHITE;
	}

	get_moves(pieceType, fromTile, toTile) {
		switch (pieceType) {
			case ChessPieceType.BLACK.PAWN:
			case ChessPieceType.WHITE.PAWN:
				break;
			case ChessPieceType.BLACK.KNIGHT:
			case ChessPieceType.WHITE.KNIGHT:
				break;	
			case ChessPieceType.BLACK.BISHOP:
			case ChessPieceType.WHITE.BISHOP:
				break;
			case ChessPieceType.BLACK.ROOK:
			case ChessPieceType.WHITE.ROOK:
				break;		
			case ChessPieceType.BLACK.QUEEN:
			case ChessPieceType.WHITE.QUEEN:
				break;	
			case ChessPieceType.BLACK.KING:
			case ChessPieceType.WHITE.KING:
				break;	
			default:
				console.log('Chess Piece Type cannot by none.');
				break;
		}
	}
}

export { Chessboard, ChessInfo };

