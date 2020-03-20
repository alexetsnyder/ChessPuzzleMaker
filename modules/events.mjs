//events.mjs

const EventTypes = {
	MOUSE_DOWN : 'mouse_down',
	MOUSE_UP   : 'mouse_up',
	MOUSE_MOVE : 'mouse_move'
}

class EventSystem {
	#canvasLeft = 0
	#canvasTop = 0 
	#delegates = {}
	#keys = []

	get delegates() {
		return this.#delegates;
	}

	constructor() {
		for (var type in EventTypes) {
			this.delegates[EventTypes[type]] = []
		}
	}

	wire_events(canvas) {
		var rect = canvas.getBoundingClientRect();
		this.#canvasLeft = rect.left;
		this.#canvasTop = rect.top;
		canvas.onmousedown = (mouseEventArgs) => this.onMouseDown(mouseEventArgs);
		canvas.onmouseup = (mouseEventArgs) => this.onMouseUp(mouseEventArgs);
		canvas.onmousemove = (mouseEventArgs) => this.onMouseMove(mouseEventArgs);
	}

	add_listener(eventType, func) {
		this.delegates[eventType].push(func);
	}

	convertScreenToCanvasPoint(eventArgs) {
		eventArgs.canvasX = eventArgs.clientX - this.#canvasLeft;
		eventArgs.canvasY = eventArgs.clientY - this.#canvasTop;
	}

	callAllDelegateOfType(eventType, eventArgs) {
		for (var func of this.delegates[eventType]) {
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

	onMouseMove(mouseEventArgs) {
		this.convertScreenToCanvasPoint(mouseEventArgs);
		this.callAllDelegateOfType(EventTypes.MOUSE_MOVE, mouseEventArgs);
	}
}

let Events = new EventSystem();

export { EventTypes, EventSystem, Events };
