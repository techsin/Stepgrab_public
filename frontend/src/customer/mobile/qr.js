import qrcode from "../../../../public/js/qrcode.min.js";

let init = function () {
	let code = document.querySelector(".codeDiv .code").innerText;

	var typeNumber = 1;
	var errorCorrectionLevel = "H";
	var qr = qrcode(typeNumber, errorCorrectionLevel);
	qr.addData(code);
	qr.make();
	document.getElementById("qrcode").innerHTML = qr.createSvgTag(15);
};

export default {
	init
}