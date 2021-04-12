import { writable } from "svelte/store";
import * as CONST from "@src/constants";

// Only "base" values stored here - that is, anything that a save game would need to recreate the save
// For other values, use computedstore
export const jiggleFactor = writable(0);
export const jiggleHigh = writable(0);
export const juice = writable(0);
export const unlock_ui = writable(false);
export const unlock_juice = writable(false);
export const level_minJiggle = writable(0);
export const level_clickPower = writable(0);
export const level_jiggleDamp = writable(0);
export const steps = writable(0);
