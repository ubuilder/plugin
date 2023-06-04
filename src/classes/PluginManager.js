import { spawn } from "child_process";

export class PluginManager {
  allPlugins = {};
  plugins = [];
  onCleans = [];

  constructor(allPlugins) {
    this.allPlugins = allPlugins;
  }

  filterPlugins(allPlugins, config) {
    Object.keys(config).map((key) => {
      if (config[key]) {
        this.plugins.push(new allPlugins[key]());
      }
    });
  }

  async init(config) {
    this.filterPlugins(this.allPlugins, config);
    let ctx = {
      restart: (config) => {
        this.restart(config);
      },
    };
    for (let plugin of this.plugins) {
      this.onCleans.push(await plugin.onInit(ctx));
    }

    return ctx;
  }

  async build(config) {
    this.filterPlugins(allPlugins, config);
    let ctx = {};
    for (let plugin of this.plugins) {
      await plugin.onBuild(ctx ?? {});
    }

    return ctx;
  }

  async restart() {
    console.log("restart");
    process.on("exit", () => {
      console.log("spawn");
      const res = spawn("node test.js &");
      console.log(res);
      setTimeout(() => {}, 1000);
    });
    process.exit(1);
  }

  async active(plugin) {
    this.plugins.push(plugin);
    await plugin.onActive();
  }

  async disable(plugin) {
    await plugin.onDisable();
    this.plugins = this.plugins.filter((p) => p !== plugin);
  }
}

