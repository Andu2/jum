export function copyState(state) {
	var newState = {};
	for (var key in state) {
		newState[key] = state[key];
	}
	return newState;
}

export function round(number, decimals) {
	var factor = Math.pow(10, decimals);
	return Math.round(number * factor) / factor;
}