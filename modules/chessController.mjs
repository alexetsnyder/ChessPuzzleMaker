//chessController.mjs
import { Chessboard, ChessPiece, ChessInfo, ChessPieceType, GetPieceSize } from './chessboard.mjs';
import { Events, EventTypes } from './events.mjs';
import { Point } from './drawing.mjs';

function GetCanvasSize() {
	var size = ChessInfo.CHESSBOARD_ROWS * ChessInfo.DEFAULT_TILE_SIZE + 6; //Add 6 for selection border
	return new Point(size, size);
}

const ChessState = {
	EDITOR    : 'editor',
	IMPORT    : 'import',
	PUZZLE    : 'puzzle',
	PLAY      : 'play',
	CUSTOMIZE : 'customize', 
	NONE      : 'none'
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

class ChessController {
	#pieces = []
	#pieceMap = {}
	#chessboard = null
	#tileSize = null
	#state = ChessState.NONE
	#isDragging = false
	#isShowGrid = false;

	constructor() {
		this.#tileSize = new Point(ChessInfo.DEFAULT_TILE_SIZE, ChessInfo.DEFAULT_TILE_SIZE);
		this.#chessboard = new Chessboard(this.#tileSize);
		var defaultTab = document.getElementById('btnBoardEditorTab');
		this.showTab(defaultTab);
		this.assayPrefabs();
		this.wire_events();
	}

	wire_events() {
		Events.add_listener(EventTypes.MOUSE_DOWN, (mouseEventArgs) => this.onMouseButtonDown(mouseEventArgs));
		Events.add_listener(EventTypes.MOUSE_UP, (mouseEventArgs) => this.onMouseButtonUp(mouseEventArgs));
		Events.add_listener(EventTypes.MOUSE_MOVE, (mouseEventArgs) => this.onMouseMove(mouseEventArgs));
		Events.add_listener(EventTypes.DROP, (dragEventArgs) => this.onDropPiece(dragEventArgs));
		this.wire_tab_events();
		this.wire_btn_events();
	}

	wire_tab_events() {
		for (var tab of document.getElementsByClassName('tabLinks')) {
			tab.onclick = (tabEventArgs) => this.onTabClicked(tabEventArgs);
		}
	}

	wire_btn_events() {
		document.getElementById('btnStartPos').onclick = (btnEventArgs) => this.onStartPosClick(btnEventArgs);
		document.getElementById('btnClear').onclick = (btnEventArgs) => this.onClearClick(btnEventArgs);
		document.getElementById('btnImportGame').onclick = () => this.onImportGameClicked();
		document.getElementById('btnShowGrid').onclick = (btnEventArgs) => this.onShowGridClicked(btnEventArgs);
	}

	getPiece(tileIndex) {
		if (tileIndex in this.#pieceMap) {
			return this.#pieceMap[tileIndex];
		}
		return null;
	}

	hasPiece(tileIndex) {
		return (tileIndex in this.#pieceMap && this.#pieceMap[tileIndex] != null);
	}

	generatePieces() {
		this.#pieces.length = 0;
		for (var index in ChessStartPosition) {
			var pieceType = ChessStartPosition[index];
			var tileCenter = this.#chessboard.getTileCenter(index);
			var chessPiece = new ChessPiece(pieceType, tileCenter, this.#tileSize);
			this.#pieceMap[index] = chessPiece;
			this.#pieces.push(chessPiece);
		}
	}

	assayPrefabs() {
		var chessPieceImages = document.getElementsByClassName('chessPieces');
		for (var chessPieceImage of chessPieceImages) {
			var pieceSize = GetPieceSize(chessPieceImage.alt, this.#tileSize);
			chessPieceImage.width = pieceSize.width;
			chessPieceImage.height = pieceSize.height;
			chessPieceImage.ondragstart = (dragEventArgs) => this.onDragStart(dragEventArgs);
		}
	}

	clear() {
		this.#pieces.length = 0;
		this.#pieceMap = {};
	}

	reset() {
		this.clear();
		this.generatePieces();
	}

	showTab(tab) {
		for (var tabLink of document.getElementsByClassName('tabLinks')) {
			tabLink.className = tabLink.className.replace(' active', '');
		}
		tab.className += ' active';
		for (var tabContent of document.getElementsByClassName('tabContent')) {
			tabContent.style.display = 'none';
		}
		var firstLetter = tab.id.slice(3, 4).toLowerCase();
		var commonName = tab.id.slice(4, tab.id.length - 3);
		var tabContentId = `${firstLetter}${commonName}Div`;
		var tabContent = document.getElementById(tabContentId);
		tabContent.style.display = 'block';
		
	}

	placePiece(piece, center) {
		piece.put(center);
	}

    addPiece(piece, index) {
		this.#pieces.push(piece);
		this.#pieceMap[index] = piece;
	}

	repositionPiece(tile) {
		var piece = this.getPiece(tile.index);
		if (piece != null) {
			this.placePiece(piece, tile.center);
		}
	}

	movePiece(srcTile, destTile) {
		var srcPiece = this.getPiece(srcTile.index);
		if (srcPiece != null && !this.hasPiece(destTile.index)) {
			this.placePiece(srcPiece, destTile.center);
			this.#pieceMap[destTile.index] = srcPiece;
			this.#pieceMap[srcTile.index] = null;
			return true;
		}
		return false;
	}

	getAllImageSrcNames() {
		var allowedNames = [];
		Object.keys(ChessPieceType.WHITE).forEach((key) => allowedNames.push(ChessPieceType.WHITE[key]));
		Object.keys(ChessPieceType.BLACK).forEach((key) => allowedNames.push(ChessPieceType.BLACK[key]));
		return allowedNames;
	}

	draw(ctx) {
		this.#chessboard.draw(ctx);
		var draggingPiece = null;
		var clickedTile = this.#chessboard.clickedTile;
		if (clickedTile != null) {
			draggingPiece = this.getPiece(clickedTile.index);
		}
		for (var piece of this.#pieces) {
			if (draggingPiece != piece) {
				piece.draw(ctx);
			}
		}
		if (draggingPiece != null) {
			draggingPiece.draw(ctx);
		}
	}

	onShowGridClicked() {
		this.#isShowGrid = !this.#isShowGrid;
		this.#chessboard.showGrid();
		if (this.#isShowGrid) {
			document.getElementById('btnShowGrid').textContent = 'Hide Grid';
		}
		else {
			document.getElementById('btnShowGrid').textContent = 'Show Grid';
		}
	}

	onTabClicked(tabEventArgs) {
		this.showTab(tabEventArgs.srcElement);
	}

	onImportGameClicked() {
		var pgnText = document.getElementById('pgnText');
		console.log(pgnText.value);
	}

	onStartPosClick(btnEventArgs) {
		this.reset();
		document.getElementById('btnClear').disabled = false;
	}

	onClearClick(btnEventArgs) {
		this.clear();
		document.getElementById('btnClear').disabled = true;
	}

	onDragStart(dragEventArgs) {
		dragEventArgs.dataTransfer.setData('pieceType', dragEventArgs.srcElement.alt);
	}

	onDropPiece(dragEventArgs) {
		var allowedSrcNames = this.getAllImageSrcNames();
		var pieceType = dragEventArgs.dataTransfer.getData('pieceType').toLowerCase();
		if (allowedSrcNames.includes(pieceType)) {
			var tile = this.#chessboard.getTileAt(dragEventArgs.mousePos);
			if (tile != null && !this.hasPiece(tile.index)) {
				var piece = new ChessPiece(pieceType, tile.center, tile.size);
				this.addPiece(piece, tile.index);
				document.getElementById('btnClear').disabled = false;
			}
		}
	}

	onMouseMove(mouseEventArgs) {
		var clickedTile = this.#chessboard.clickedTile;
		if (this.#isDragging && clickedTile != null) {
			var piece = this.getPiece(clickedTile.index);
			if (piece != null) {
				var mousePos = mouseEventArgs.mousePos;
				var newPos = new Point(mousePos.x - piece.width / 2, mousePos.y - piece.height / 2);
				piece.setPos(newPos);
			}
		}
	}

	onMouseButtonUp(mouseEventArgs) {
		this.#isDragging = false;
		var clickedTile = this.#chessboard.clickedTile;
		if (clickedTile != null) {
			var nextTile = this.#chessboard.getTileAt(mouseEventArgs.mousePos);

			if (!this.movePiece(clickedTile, nextTile))
			{
				this.repositionPiece(clickedTile);
			}
			else {
				clickedTile.unselect();
				this.#chessboard.unselect();
			}
		}
	}

	onMouseButtonDown(mouseEventArgs) {
		this.#isDragging = true;
		var previousTile = this.#chessboard.selectedTile;
		if (this.#chessboard.selectTileAt(mouseEventArgs.mousePos)) {
			if (previousTile != null) {
				var selectedTile = this.#chessboard.selectedTile;
				if (previousTile != selectedTile) {
					this.movePiece(previousTile, selectedTile);
				}
				else {
					this.#chessboard.unselect();
				}
			}
		}	
	}
}

export { ChessController, GetCanvasSize };