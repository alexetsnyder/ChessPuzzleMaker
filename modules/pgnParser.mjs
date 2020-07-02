//pgnParser.mjs
import { Point } from './drawing.mjs';

function isEmptyOrWhiteSpace(string) {
	return string.trim().length === 0;
}

class ChessMove {
	#moveNumber = 0
	#whiteMove = ''
	#blackMove = ''

	get moveNumber() {
		return this.#moveNumber;
	}

	set moveNumber(value) {
		this.#moveNumber = value;
	}

	get whiteMove() {
		return this.#whiteMove;
	}

	set whiteMove(value) {
		this.#whiteMove = value;
	}

	get blackMove() {
		return this.#blackMove;
	}

	set blackMove(value) {
		this.#blackMove = value;
	}

	constructor(moveNumber, white, black) {
		this.moveNumber = moveNumber;
		this.whiteMove = white;
		this.blackMove = black;
	}
}

class ChessGame {
	#chessMoves = null

	constructor() {
		
	}


}

class String {
	#string = ''
	#quotes = ['\'', '\"']

	get string() {
		return this.#string;
	}

	set string(value) {
		this.#string = value;
	}

	constructor(string) {
		this.string = string;
	}

	isEmptyOrWhiteSpace() {
		return isEmptyOrWhiteSpace(this.string);
	}

	add(char) {
		this.string += char;
	}

	clear() {
		this.string = '';
	}

	split(splitChar=' ') {
		var currentWord = new String('');
		var stringList = [];
		var isInQuotes = false;
		for (var i = 0; i < this.string.length; i++) {
			var char = this.string.charAt(i);
			if (!isInQuotes && char === splitChar) {
				if (!currentWord.isEmptyOrWhiteSpace()) {
					stringList.push(currentWord.string);
					currentWord.clear();
				}
			}
			else if (char === '\'' || char === '\"') {
				isInQuotes = !isInQuotes;
			}
			else {
				currentWord.add(char);
			}
		}
		if (!currentWord.isEmptyOrWhiteSpace()) {
			stringList.push(currentWord.string);
		}
		return stringList;
	}
}

class PGNParser {
	#quoteChars = ['\"', '\'']
	#pgnData = null
	#pgnText = ''
	#lineNumber = 0
	#pgnLineArray = null

	get pgnText() {
		return this.#pgnText;
	}

	set pgnText(value) {
		this.#pgnText = value;
	}

	get lineNumber() {
		return this.#lineNumber;
	}

	set lineNumber(value) {
		this.#lineNumber = value;
	}

	get pgnLineArray() {
		return this.#pgnLineArray;
	}

	set pgnLineArray(value) {
		this.#pgnLineArray = value;
	}

	get pgnData() {
		return this.#pgnData;
	}

	set pgnData(value) {
		this.#pgnData = value;
	}

	constructor(pgnText) {
		this.lineNumber = 0
		this.pgnText = pgnText;
		this.pgnLineArray = this.pgnText.split('\n'); 
		this.pgnData = {};
	}

	parse() {
		while (this.lineNumber < this.pgnLineArray.length) {
			var line = this.getCurrentLine();
			if (!isEmptyOrWhiteSpace(line)) {
				if (line.startsWith('[')) {
					this.parseTag(line);
				}
				else {
					this.parseGameLine(line);
				}
			}
			this.lineNumber++;
		}
		console.log(this.pgnData);
	}

	parseTag(line) {
		var dataLine = new String(line.slice(1, -1));
		var [key, value] = dataLine.split();
		this.pgnData[key] = value; 
	}

	parseGameLine(line) {
		if (!('moves' in this.pgnData)) {
			this.pgnData['moves'] = {};
		}
		console.log('parseGameLine:');
		this.logLineError(line);
	}

	getMove(line) {

	}

	logLineError(line) {
		console.log(`${this.lineNumber + 1}) ${line}`);
	}

	getCurrentLine() {
		return this.pgnLineArray[this.lineNumber];
	}
}

export { PGNParser }