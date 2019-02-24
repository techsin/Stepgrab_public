var placeSearch, autocomplete;
var eles = {
	street: document.getElementById("street"),
	city: document.getElementById("city"),
	state: document.getElementById("state"),
	country: document.getElementById("country"),
	zipcode: document.getElementById("zipcode")
};

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical location types.
	autocomplete = new google.maps.places.Autocomplete(
		document.getElementById("street"),
		{ types: ["geocode"] }
	);

	// When the user selects an address from the dropdown, populate the address fields in the form.
	autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
	// Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    let street_number = place.address_components.find( x=> x.types.includes("street_number")).long_name;
    let street_name = place.address_components.find( x=> x.types.includes("route")).long_name;
    eles.street.value = street_number + " " + street_name;
    eles.city.value = place.address_components.find( x=> x.types.includes("locality") || x.types.includes("sublocality_level_1") || x.types.includes("sublocality")).long_name;
    eles.state.value = place.address_components.find( x=> x.types.includes("administrative_area_level_1")).long_name;
    eles.zipcode.value =  place.address_components.find( x=> x.types.includes("postal_code")).long_name;
    eles.country.value = place.address_components.find( x=> x.types.includes("country")).short_name;

}

// Bias the autocomplete object to the user's geographical location, as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var geolocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var circle = new google.maps.Circle({
				center: geolocation,
				radius: position.coords.accuracy
			});
			autocomplete.setBounds(circle.getBounds());
		});
	}
}


let $street = document.querySelector("#street");
$street.addEventListener("focus", function(){
	geolocate();
});