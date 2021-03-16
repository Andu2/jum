// import App from './App.svelte';

// const app = new App({
// 	target: document.body
// });

// export default app;

import { init } from "@src/important-code";

if (document.readyState === "complete") {
	init();
}
else {
	document.addEventListener("DOMContentLoaded", init);
}