import mapCtrl from "./mapCtrl";
var $deals = document.querySelector(".deals");
let frag = document.createDocumentFragment();
let count = 1;

function buildList(d) {
	let div = document.createElement("div");

	let deal = div.cloneNode();
	let number = div.cloneNode();
	let title = div.cloneNode();
	let name = div.cloneNode();
	let rating = div.cloneNode();
	let category = div.cloneNode();

	deal.className = "deal";
	number.className = "number";
	title.className = "title";
	name.className = "name";
	rating.className = "rating";
	category.className = "category";

	number.innerText = count++;
	title.innerText = d.title;
	name.innerText = d.User.company;
	rating.innerText = 4.5;
	category.innerText = "Food";

	deal.appendChild(number);
	deal.appendChild(title);
	deal.appendChild(name);
	deal.appendChild(rating);
	deal.appendChild(category);
	deal.addEventListener("click", handleClick.bind(null, d));
	frag.appendChild(deal);
}

function handleClick(d) {
	mapCtrl.createPopup(d.marker, d);
	mapCtrl.move(d.marker);
}

function clearList() {
	while ($deals.firstChild) {
		$deals.removeChild($deals.firstChild);
	}
}

function addToDOM() {
	clearList();
	$deals.appendChild(frag);
	count = 1;
}

export {
	buildList,
	addToDOM
}