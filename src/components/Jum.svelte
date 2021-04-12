<script>
	export let jiggle = 0;
	export let inflate = 1;

	import { jiggleFactor, jiggleHigh } from "@src/stores/save";
	import { clickPower } from "@src/stores/computed";

	function increaseJiggle(event) {
		let newJiggle = $jiggleFactor + $clickPower;
		if (newJiggle > $jiggleHigh) {
			jiggleHigh.set(newJiggle);
		}
		jiggleFactor.set(newJiggle);
	}
</script>

<div>
	<img src="images/jum.svg" on:click={increaseJiggle} />
</div>

<style>
	div {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	img {
		position: absolute;
		left: 0; right: 0; top: 0; bottom: 0;
		margin: auto;
		width: 50px;
		height: 50px;
		cursor: pointer;
		opacity: 0.9;
	}

	img:hover {
		opacity: 1;
	}
</style>