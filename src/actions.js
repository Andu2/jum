import { copyState } from "@src/util"
import { log, state, defaults, stepTime } from "@src/important-code";

var action = {};

action.initDefaults = function(state) {
	var newState = copyState(state);
	for (var key in defaults) {
		newState[key] = defaults[key];
	}
	return newState;
}

action.jiggle = function(state) {
	var newState = copyState(state);
	newState.jiggleFactor += newState.clickPower;
	if (newState.jiggleFactor > state.jiggleHigh) {
		newState.jiggleHigh = newState.jiggleFactor;
	}
	return newState;
}

action.step = function(state) {
	var newState = copyState(state);
	newState.juice += newState.jiggleFactor * stepTime;
	newState.jiggleFactor *= Math.pow(newState.jiggleDamp, stepTime);
	if (newState.jiggleFactor < newState.jiggleBaseline) {
		newState.jiggleFactor = newState.jiggleBaseline;
	}
	return newState;
}

var logTimesString = ":: TIMES ::";
export function doAction(actionName) {
	// Any additional arguments will be added to action call
	var actionArgs = []
	for (var i = 1; i < arguments.length; i++) {
		actionArgs.push(arguments[i]);
	}
	var logString = "ACTION :: " + actionName + " (" + actionArgs.join(", ") + ")";
	if (log.length > 0 && log[log.length - 1].indexOf(logString) === 0) {
		var countIndex = log[log.length - 1].indexOf(logTimesString);
		if (countIndex !== -1) {
			var currentCount = log[log.length - 1].slice(countIndex + logTimesString.length + 1) * 1;
			var newCount = currentCount + 1;
			log[log.length - 1] = log[log.length - 1].slice(0, countIndex) + logTimesString + " " + newCount;
		}
		else {
			log[log.length - 1] += " " + logTimesString + " 1";
		}
	}
	else {
		log.push(logString);
	}
	var newState = action[actionName].apply(null, [state].concat(actionArgs));
	for (var key in newState) {
		state[key] = newState[key];
	}
}