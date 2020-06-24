//chessAI.mjs
import { Point } from './drawing.mjs';

class Vector extends Point {
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