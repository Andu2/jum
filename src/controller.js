import * as save from "@src/stores/save";
import * as computed from "@src/stores/computed";

const STEP_TIME = 0.05; // s
let lastStepTime;
let leftoverStepDelta = 0;

let juice = 0;
let jiggleFactor = 0;
let jiggleDamp = 0.5;
let jiggleBaseline = 0;

// No need to unsubscribe
// This is extremely boilerplatey...
save.juice.subscribe(function(value) {
	juice = value;
});
save.jiggleFactor.subscribe(function(value) {
	jiggleFactor = value;
});
computed.jiggleDamp.subscribe(function(value) {
	jiggleDamp = value;
});
computed.jiggleBaseline.subscribe(function(value) {
	jiggleBaseline = value;
});

export function start() {
	requestAnimationFrame(update);
}

function update(time) {
	// Game steps
	if (lastStepTime !== undefined) {
		let delta = (time - lastStepTime) / 1000 + leftoverStepDelta; // s
		while (delta >= STEP_TIME) {
			step();
			delta -= STEP_TIME;
		}
		leftoverStepDelta = delta;

		// Animation updates
		// ...nothing
	}
	
	lastStepTime = time;
	requestAnimationFrame(update);
}

function step() {
	let juiceAdd = jiggleFactor * STEP_TIME;
	save.juice.set(juice + juiceAdd);

	let newJiggle = jiggleFactor * Math.pow(jiggleDamp, STEP_TIME);
	if (newJiggle < jiggleBaseline) {
		newJiggle = jiggleBaseline;
	}
	save.jiggleFactor.set(newJiggle);
	save.steps.update(function(steps) {
		return steps + 1;
	})
}