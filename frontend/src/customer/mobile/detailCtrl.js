function dealTemp(deal) {
	return (`
	<div>
		<div class='deal'>
			<div class='left'>
				<div class='title'>
					<h1>${deal.title.toUpperCase()}</h1>
					<div class='rating'> 
						<div class='number'>33</div>
						<img class='icon' src='/img/thumbs-up.svg'/>
					</div>
				</div>
				<p class='description'>${deal.description}</p>
				<p class='name'>${deal.User.company}</p>
			</div>
			<div class='right'>
				<a href='/b/${deal.User.uuid}'> 
					<img src="/img/right-arrow.svg" />
				</a>
			</div>
		</div>
		<div class='customDeal'> 
		</div>
	</div>
	`)
}

function emptyDiv(div) {
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
}

class DetailCtrl {
	constructor() {
		this.$div = document.querySelector("#detail");
	}
	show(deal) {
		emptyDiv(this.$div);
		this.$div.innerHTML = dealTemp(deal);
	}

	hideDetail() {
		emptyDiv(this.$div);
	}
}

export default new DetailCtrl();