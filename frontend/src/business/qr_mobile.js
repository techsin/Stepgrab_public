let scanner,
	all_cameras = [],
	current_camera;

let $ = {
	preview: document.querySelector("#preview-div"),
	cycleBtn: document.querySelector("#preview-div .cycle-cameras"),
	error: document.querySelector(".field.qr.btn pre.error"),
	qrBtn: document.querySelector(".qr.btn .button"),
	video: document.querySelector("#preview-div #preview"),
	exitBtn: document.querySelector("#preview-div .exit"),
	codeInput: document.querySelector(".code-input"),
	form: document.querySelector("form.form")
};

export default async function () {
	scanner = new Instascan.Scanner({ video: $.video }); // eslint-disable-line

	scanner.addListener("scan", function (content) {
		$.codeInput.value = content;
		$.form.submit();
		hide_camera_preview();
	});

	$.qrBtn.addEventListener("click", startScanning, false);
	$.cycleBtn.addEventListener("click", cycleCameras, false);
	$.exitBtn.addEventListener("click", exitBtn, false);
}

function exitBtn() {
	hide_camera_preview();
}

function startScanning() {
	Instascan.Camera.getCameras().then(function (cameras) { // eslint-disable-line
		if (cameras.length == 1) {
			scanner.start(cameras[0]);
			open_camera_preview(false);
		}
		if (cameras.length > 1) {
			all_cameras = cameras;
			let rear = cameras.find(x => x.name.includes("back"));
			if (rear) {
				scanner.start(rear);
				current_camera = rear;
			} else {
				scanner.start(cameras[0]);
			}
			open_camera_preview(true);

		} else {
			hide_camera_preview(true);
		}
	}).catch(function (e) {
		hide_camera_preview(true);
		console.error(e);
	});
}

function cycleCameras() {
	let i = all_cameras.indexOf(current_camera);
	if (i < 0) {
		i = 0;
	} else {
		i = ++i % all_cameras.length;
	}
	current_camera = all_cameras[i];
	scanner.stop();
	scanner.start(current_camera);
}

function hide_camera_preview(showError) {
	scanner.stop();
	$.preview.classList.add("hide");
	if (showError) {
		$.error.classList.remove("is-invisible");
		$.error.innerText = "No Camera Found";
	}
}

function open_camera_preview(showCycleBtn) {
	$.error.classList.add("is-invisible");
	$.preview.classList.remove("hide");
	if (showCycleBtn) {
		$.cycleBtn.classList.remove("hide");
	} else {
		$.cycleBtn.classList.add("hide");
	}
}