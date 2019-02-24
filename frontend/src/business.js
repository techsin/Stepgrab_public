import qr_mobile from "./business/qr_mobile";
import membership from "./business/membership";

let id = document.body.id;

switch (id) {
	case "mobile":
		qr_mobile();
		break;
	case "membership":
		membership();
		break;

	default:
		break;
}