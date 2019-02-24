import state from "./state";

export default async function loadTile(tile) {
	try {
		const tiles = (state.tiles = state.tiles || {});
		state.deals = state.deals || [];
		const uid = `${tile.x}/${tile.y}`;

		if (!tiles[uid]) {
			const response = await fetch(
				`/api/deals?tileX=${tile.x}&tileY=${tile.y}`,
				{ credentials: "same-origin" }
			);
			const json = await response.json();
			tiles[uid] = true;
			state.deals = state.deals.concat(json);
		}
	} catch (error) {
		console.log(error);
	}
}
