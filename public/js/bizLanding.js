function onSubmit(token) {
	const form = document.getElementById("login-form");
	if (form.checkValidity()) {
		form.submit();
	} else {
		form.reportValidity();
	}
}