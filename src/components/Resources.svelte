<script>
	import { jiggleFactor, jiggleHigh, juice, steps } from "@src/stores/save";
	import { round } from "@src/utils"

	const res = {
		jiggleFactor: {
			displayName: "Jiggle Factor"
		},
		jiggleHigh: {
			displayName: "Jiggle High"
		},
		juice: {
			displayName: "Jiggle Juice"
		},
		steps: {
			displayName: "Steps"
		}
	}

	// Wish I could do this in a loop but whatevs
	$: res.jiggleFactor.value = $jiggleFactor;
	$: res.jiggleHigh.value = $jiggleHigh;
	$: res.juice.value = $juice;
	$: res.steps.value = $steps;

</script>

<div>
	{#each Object.keys(res) as resName}
	<div>
		{res[resName].displayName}: {round(res[resName].value, 2)}
	</div>
	{/each}
</div>

<style>

</style>