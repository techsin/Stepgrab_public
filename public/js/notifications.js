let remove_btns = document.querySelectorAll(".num");


remove_btns.forEach(function ($row) {
	let id = $row.querySelector("input[type=\"hidden\"]").value;
	let remove_btn = $row.querySelector("input.remove");
	remove_btn.addEventListener("click", function (e) {
		fetch(`/dashboard/number/${id}`, {
			method: "DELETE",
			credentials: "same-origin",
			redirect: "follow"
		}).then(()=> location.reload());
	});
});