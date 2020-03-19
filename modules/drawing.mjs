//drawing.mjs

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
		this.setSize(width, height);
		this.setPos(left, top);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
	}

	setPos(left, top) {
		this.left = left;
		this.right = left + this.width;
		this.top = top;
		this.bottom = top + this.height;
		this.cx = left + this.width / 2;
		this.cy = top + this.height / 2;
	}
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

	set string(val) {
		this.#string = val;
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

export { Rect, Text, Sprite };