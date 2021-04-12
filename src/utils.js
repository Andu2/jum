export function round(number, decimals) {
	var factor = Math.pow(10, decimals);
	return Math.round(number * factor) / factor;
}
