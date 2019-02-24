//TODO: refactor to allow physics and time based animation

class MenuCtrl {
	init() {
		this.$ = {
			btn: $("#menu_btn"),
			menu: $("#menu"),
			body: $("body")
		}

		this.state = {
			open: false,
			start_touch: null,
			last_touch: null,
			tolerance: 15,
			delta: null,
			menu_width: null,
			dragging: false
		}

		this.$.btn.addEventListener("click", this.openMenu.bind(this), false);
		this.$.body.addEventListener("click", this.bgClick.bind(this), false);
		this.$.body.addEventListener("touchstart", this.touchStart.bind(this), false);
		this.$.body.addEventListener("touchmove", this.touchMove.bind(this), false);
		this.$.body.addEventListener("touchend", this.touchEnd.bind(this), false);
	}

	touchStart(event) {
		if (!this.state.open) {
			return;
		}
		this.disableTransition();
		this.state.start_touch = event.targetTouches[0];
		this.state.menu_width = this.$.menu.getBoundingClientRect().width;
	}

	touchMove(event) {
		if (!this.state.open) return;

		let start = this.state.start_touch;
		let end = Array.from(event.targetTouches).find(x => x.identifier == start.identifier);

		if (!end) return;

		this.state.delta = diff(start.screenX, end.screenX);

		if (!this.state.dragging && this.state.delta > this.state.tolerance) {
			this.state.dragging = true;
		}

		if (this.state.dragging) {
			if (this.state.delta < 0) {
				this.state.delta = 0;
			}
			this.dragMenu();
		}
	}

	touchEnd() {
		if (this.state.dragging === false) return;

		this.enableTransition();
		this.state.dragging = false;
		this.$.menu.removeAttribute("style");
		if (this.state.delta > this.state.menu_width / 3) {
			this.closeMenu();
		} else {
			this.openMenu();
		}
	}

	disableTransition() {
		this.$.menu.classList.add("no-transition");
	}

	enableTransition() {
		this.$.menu.classList.remove("no-transition");
	}

	dragMenu() {
		let delta = this.state.delta;
		this.$.menu.style.transform = `translateX(-${delta}px)`;
	}

	bgClick(event) {
		let target = event.target;
		if (target == this.$.btn || this.$.btn.contains(target)) {
			return;
		}
		this.enableTransition();
		this.closeMenu();
	}

	openMenu() {
		this.$.menu.classList.add("open");
		this.state.open = true;
	}

	closeMenu() {
		this.$.menu.classList.remove("open");
		this.state.open = false;
		this.state.start_touch = null;
		this.state.delta = null;
		this.state.menu_width = null;
		this.state.dragging = false;
	}
}

function $(selector) {
	return document.querySelector(selector);
}

function diff(a, b) {
	return a - b;
}

export default new MenuCtrl;