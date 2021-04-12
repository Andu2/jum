import { derived } from "svelte/store";
import * as CONST from "@src/constants";
import * as save from "@src/stores/save";

export const jiggleBaseline = derived(save.level_minJiggle, function(level_minJiggle) {
	return level_minJiggle;
});

export const jiggleDamp = derived(save.level_jiggleDamp, function(level_jiggleDamp) {
	return Math.pow(0.9, level_jiggleDamp) * CONST.BASE_JIGGLE_DAMP;
});

export const clickPower = derived(save.level_clickPower, function(level_clickPower) {
	return CONST.BASE_CLICK_POWER + 0.2 * level_clickPower;
});
