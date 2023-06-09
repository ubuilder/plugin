import { BasePlugin } from "../classes/Plugin.js";

export class SveltePlugin extends BasePlugin {
  onBuild() {
    console.log("build svelte files");
  }
}
