import mapCtrl from "./mapCtrl";

let filters = [
	{
		value: "All"
	},
	{
		value: "Food"
	},
	{
		value: "Beauty"
	},
	{
		value: "Clothing"
	},
	{
		value: "Other"
	}
];

let active = null;
let frag = document.createDocumentFragment();

filters.forEach(function (f) {
	let div = document.createElement("div");
	div.classList.add("item");
	div.innerText = f.value;
	div.addEventListener("click", handleClick.bind(null, f));
	f.$ele = div;
	frag.appendChild(div);
});

document.querySelector("#list .filters").appendChild(frag);
activate(filters[0]);

function handleClick(filter) {
	if (active == filter) {
		return;
	}
	activate(filter);
	mapCtrl.updateMarkers();
}

function activate(filter) {
	active = filter;
	filters.forEach(x => x.$ele.classList.remove("active"));
	filter.$ele.classList.add("active");
}


export function filter(deal) {
	if (active.value === "All") {
		return true;
	}
	return deal.category.toLowerCase() === active.value.toLowerCase();
}