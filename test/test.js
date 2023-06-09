import { PluginManager } from "../src/PluginManager.js";

const pm = PluginManager({
  config: "./plugins.json",
});

const basePlugin = {
  async onStart(ctx) {
    console.log("start of plugin base", { ctx });
    ctx.test = 2;
  },
  onInstall(ctx) {
    console.log("installing plugin base...");
    console.log("this is base!");
  },
};

const nextPlugin = {
  async onStart(ctx) {
    console.log("start of plugin next", { ctx });
    setTimeout(() => {
        ctx.pm.install('last', lastPlugin, ctx)
    }, 1000)
    ctx.next = 4;
  },
  onInstall(ctx) {
    console.log("installing plugin next  ...");
    console.log("this is next!");
  },
  onRemove(ctx) {
    console.log("removing next...");
  },
};

const lastPlugin = {
  onStart(ctx) {
    console.log("start of plugin last", { ctx });
  },
};

await pm.install("base", basePlugin);
await pm.install("next", nextPlugin);
// await pm.remove("next", {});

pm.start({ pm });
