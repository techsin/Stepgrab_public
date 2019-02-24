import "./touch_hack";
import map from "./mapCtrl";
import menuCtrl from "./menuCtrl";
import qr from "./qr";
export default function () {
	let id = document.body.id;
	switch (id) {
		case "map":
			map.init();
			break;
		case "dealView":
			qr.init();
			break;

		default:
			break;
	}

	menuCtrl.init();
}