import { doAction } from "@src/actions";
import { round } from "@src/util"

export var log = [];

export var state = {};
var animationTicksPerSecond = 30;
var ticksPerSecond = 20;
var tickTime = 1000 / ticksPerSecond;
var leftoverStepProgress = 0;
export var stepTime = tickTime / 1000;

export var defaults = {
	jiggleFactor: 0,
	jiggleHigh: 0,
	juice: 0,
	jiggleBaseline: 0,
	jiggleDamp: 0.5, // approximate multiplier of jiggleFactor per second
	clickPower: 1,
	needsUiRecalc: true,
	unlocked: {
		ui: false,
		juice: false
	},
	upgrades: {
		minJiggle: 0,
		clickPower: 0,
		jiggleDamp: 0
	},
	upgradeCosts: {
		minJiggle: 300,
		clickPower: 500,
		jiggleDamp: 1000
	}
}

export function init() {
	doAction("initDefaults");

	var buttons = document.querySelectorAll(".button");
	for (var i = 0; i < buttons.length; i++) {
		buttonColors.push({
			element: buttons[i],
			red: 128,
			green: 128,
			blue: 128
		});
		buttons[i].addEventListener("click", processUpgrade)
	}

	var lastTickTime = Date.now();
	var tickLoop = setInterval(function() {
		var currentTickTime = Date.now();
		var timeFactor = (currentTickTime - lastTickTime) / 1000;
		lastTickTime = currentTickTime;
		checkUnlocks();
		doSteps(timeFactor);
	}, tickTime)

	var animationLoop = setInterval(function() {
		doAnimations();
	}, 1000 / animationTicksPerSecond);
}

function checkUnlocks() {
	if (!state.unlocked.juice && state.juice > 200) {
		state.unlocked.juice = true;
		state.needsUiRecalc = true;
	}
}

// timeFactor is fractions of a second. All modifiers are stated per second and multiplied by stepTime.
function doSteps(timeFactor) {
	checkUnlocks();
	var timeToDo = timeFactor + leftoverStepProgress;
	while (timeToDo > stepTime) {
		doAction("step");
		timeToDo -= stepTime;
	}
	leftoverStepProgress = timeToDo;
}

var audio = new AudioContext();
var oscillator = audio.createOscillator();
oscillator.connect(audio.destination);
oscillator.frequency.value = 20;
oscillator.setPeriodicWave(audio.createPeriodicWave([0, 0.05], [0, 0], {disableNormalization: true}));
oscillator.start();

var buttonColors = [];

var xPos = 0;
var yPos = 0;
var xVel = 0;
var yVel = 0;

function doAnimations() {
	var xSnap = xPos; // Elastic force, proportional to distance by Hooke's law
	var ySnap = yPos; // Elastic force, proportional to distance by Hooke's law
	var xFriction = xVel * 0.2;
	var yFriction = yVel * 0.2;
	var xAcc = (Math.random() * 2 - 1) * Math.pow(state.jiggleFactor, 1.5) - xSnap - xFriction;
	var yAcc = (Math.random() * 2 - 1) * Math.pow(state.jiggleFactor, 1.5) - ySnap - yFriction;

	xVel += xAcc;
	yVel += yAcc;

	xPos += xVel;
	yPos += yVel;

	document.getElementById("important").style.left = (xPos / 20) + "%";
	document.getElementById("important").style.top = (yPos / 20) + "%";

	buttonColors.forEach(function(colorObj) {
		["red", "green", "blue"].forEach(function(color) {
			colorObj[color] += Math.random() * 10 - 5;
			if (colorObj[color] < 0) colorObj[color] = 0;
			if (colorObj[color] > 255) colorObj[color] = 255;
		});
		colorObj.element.style.backgroundColor = "rgb(" + colorObj.red + "," + colorObj.green + "," + colorObj.blue + ")"
	});

	document.getElementById("value_jiggle").innerHTML = round(state.jiggleFactor, 2);
	document.getElementById("value_high").innerHTML = round(state.jiggleHigh, 2);
	document.getElementById("value_juice").innerHTML = round(state.juice, 2);

	oscillator.frequency.value = Math.pow(state.jiggleFactor, 1.5) + 20;

	if (state.needsUiRecalc) {
		state.needsUiRecalc = false;
		document.getElementById("level_upgrade_minjiggle").innerHTML = state.upgrades.minJiggle;
		document.getElementById("level_upgrade_clickpower").innerHTML = state.upgrades.clickPower;
		document.getElementById("level_upgrade_jiggledamp").innerHTML = state.upgrades.jiggleDamp;

		document.getElementById("cost_upgrade_minjiggle").innerHTML = Math.floor(state.upgradeCosts.minJiggle);
		document.getElementById("cost_upgrade_clickpower").innerHTML = Math.floor(state.upgradeCosts.clickPower);
		document.getElementById("cost_upgrade_jiggledamp").innerHTML = Math.floor(state.upgradeCosts.jiggleDamp);

		var elementsToShow;
		if (state.unlocked.ui) {
			elementsToShow = document.querySelectorAll(".unlock_ui");
			for (var i = 0; i < elementsToShow.length; i++) {
				elementsToShow[i].style.display = "block";
			}
		}
		if (state.unlocked.juice) {
			elementsToShow = document.querySelectorAll(".unlock_juice");
			for (var i = 0; i < elementsToShow.length; i++) {
				elementsToShow[i].style.display = "block";
			}
		}
	}
}

var firstClick = true;

document.addEventListener("click", function(event) {
	doAction("jiggle");
	if (firstClick) {
		firstClick = false;
		audio.resume();
		state.unlocked.ui = true;
		state.needsUiRecalc = true;
	}
});

var juiceSounds = [];
var juiceSoundCount = 13;
for (var i = 1; i <= juiceSoundCount; i++) {
	juiceSounds.push(new Audio("sound/juice" + i + ".mp3"));
}

function processUpgrade(event) {
	var idMap = {
		"upgrade_minjiggle": "minJiggle",
		"upgrade_clickpower": "clickPower",
		"upgrade_jiggledamp": "jiggleDamp"
	}
	var upgradeId = idMap[event.currentTarget.id];
	// Take the floor of the cost so we don't get fractional costs,
	// but don't round between purchases to keep our formulas nice and pure
	if (state.juice >= Math.floor(state.upgradeCosts[upgradeId])) {
		state.juice -= Math.floor(state.upgradeCosts[upgradeId]);
		state.upgrades[upgradeId]++;
		state.needsUiRecalc = true;

		// For maximum fun, upgrade cost increases are different for every upgrade
		if (upgradeId === "minJiggle") {
			state.jiggleBaseline++;
			state.upgradeCosts.minJiggle *= 1.1;
		}
		else if (upgradeId === "clickPower") {
			state.clickPower += 0.2;
			state.upgradeCosts.clickPower = state.upgradeCosts.clickPower * 1.05 + 100;
		}
		else if (upgradeId === "jiggleDamp") {
			state.jiggleDamp = 1 - ((1 - state.jiggleDamp) * 0.85);
			state.upgradeCosts.jiggleDamp += 500 * Math.pow(1.1, state.upgrades.jiggleDamp);
		}
	}
	else {
		juiceSounds[Math.floor(Math.random() * juiceSoundCount)].play();
		document.getElementById("jum").style.display = "block";
		setTimeout(function() {
			document.getElementById("jum").style.display = "none";
		}, 1500)
	}
}
