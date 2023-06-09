import fs from "fs";

export function PluginManager({ config } = {}) {

  function getConfig() {
    let result = {};
    if (config.endsWith(".json")) {
      if (!fs.existsSync(config)) {
        fs.writeFileSync(config, "{}");
      }
      result = JSON.parse(fs.readFileSync(config, "utf-8") ?? "{}");
    } else {
      console.log("config file should be json file.");
    }

    if (!result.plugins) result.plugins = [];
    return result;
  }
  async function setConfig(value = {}) {
    if (!config.endsWith(".json")) {
      console.log("config file should be json file. Will not save state");
      return;
    }
    return fs.writeFileSync(config, JSON.stringify(value));
  }
  async function updateConfig(updater) {
    const before = getConfig()
    const after = updater(JSON.parse(JSON.stringify(before)))

    if(JSON.stringify(before) !== JSON.stringify(after)) {
      setConfig(after);
    }
    
  }

  let plugins = [];

  async function install(name, methods, ctx) {
    // plugins[name] = methods;
    if (config) {
      updateConfig((val) => {
        if (!val.plugins) val.plugins = [];

        if (val.plugins.find((x) => x.name === name)) {
          console.log(`plugin "${name}" is already installed!`);
          plugins.push({ name, methods });
          return val;
        }
        val.plugins.push({ name, order: 1, active: true });
        plugins.push({ name, methods });

        if (methods.onInstall) {
          methods.onInstall(ctx);
        }

        return val;
      });
    }
  }

  async function remove(name, ctx) {
    updateConfig((cfg) => {
      if (!cfg.plugins.find((x) => x.name === name)) {
        console.log(`plugin "${name} is not installed!`);
        return cfg;
      }

      //   remove from config file
      cfg.plugins = cfg.plugins.filter((x) => x.name !== name);

      // run onRemove method
      const plugin = plugins.find((x) => x.name === name);
      if (plugin?.methods.onRemove) {
        plugin.methods.onRemove(ctx);
      }
      // remove from local state
      plugins = plugins.filter((x) => x.name !== name);

      return cfg;
    });
  }

  async function start(ctx) {
    const config = getConfig();

    for (let plugin of plugins) {
      if (config.plugins.find((x) => x.name === plugin.name)) {
        if (plugin.methods.onStart) {
          console.log("running plugin: " + plugin.name);
          await plugin.methods.onStart(ctx);
        }
      }
    }
  }

  async function enable(name) {
    updateConfig((cfg) => {
      return {
        ...cfg,
        plugins: cfg.plugins.map((plugin) => {
          if (plugin.name === name) {
            if (!plugin.active) {
              plugin.active = true;
              if (plugins[name].methods.onEnable) {
                plugins[name].methods.onEnable();
              }
            }

            return plugin;
          }
        }),
      };
    });
  }
  async function disable(name) {
    updateConfig((cfg) => {
      return {
        ...cfg,
        plugins: cfg.plugins.map((plugin) => {
          if (plugin.name === name) {
            if (plugin.active) {
              plugin.active = false;
              if (plugins[name].methods.onDisable) {
                plugins[name].methods.onDisable();
              }
            }
            return plugin;
          }
        }),
      };
    });
  }

  return {
    install,
    remove,
    start,
    enable,
    disable,
  };
}
