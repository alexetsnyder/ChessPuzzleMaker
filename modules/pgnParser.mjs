//pgnParser.mjs
import { Point } from './drawing.mjs';

function isEmptyOrWhiteSpace(string) {
	return string.trim().length === 0;
}

class PGNParser {
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

	constructor(pgnText) {
		this.lineNumber = 0
		this.pgnText = pgnText;
		this.pgnLineArray = this.pgnText.split('\n'); 
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
	}

	parseTag(line) {
		console.log('parseTag:');
		this.logLineError(line);
	}

	parseGameLine(line) {
		console.log('parseGameLine:');
		this.logLineError(line);
	}

	logLineError(line) {
		console.log(`${this.lineNumber + 1}) ${line}`);
	}

	getCurrentLine() {
		return this.pgnLineArray[this.lineNumber];
	}
}

export { PGNParser }