import fs from "fs";

export function PluginManager({ config, ctx = {} } = {}) {
  let localConfig = { plugins: []};
  function getConfig() {
    let result = {};
    if (config?.endsWith(".json")) {
      if (!fs.existsSync(config)) {
        fs.writeFileSync(config, "{}");
      }
      result = JSON.parse(fs.readFileSync(config, "utf-8") ?? "{}");
    } else {
      console.log("config file should be json file.");
      return localConfig;
    }

    if (!result.plugins) result.plugins = [];
    return result;
  }
  async function setConfig(value = {}) {
    if (!config?.endsWith(".json")) {
      console.log("config file should be json file. Will not save state");
      localConfig = value;
      return;
    }
    return fs.writeFileSync(config, JSON.stringify(value));
  }
  async function updateConfig(updater) {
    const before = getConfig();
    const after = await updater(JSON.parse(JSON.stringify(before)));

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      setConfig(after);
    }
  }

  let plugins = [];

  async function install(name, methods) {
    // plugins[name] = methods;
    if (methods.updateCtx) {
      console.log("install " + name, methods);
      methods.updateCtx(ctx);
    }

    await updateConfig(async (val) => {
      if (val.plugins.find((x) => x.name === name)) {
        console.log(`Plugin "${name}" is already installed!`);
      } else {
        console.log(`Installing plugin "${name}..."`);

        // Install and run onInstall of the plugin
        val.plugins.push({ name, order: 1, active: true });
        if (methods.onInstall) {
          await methods.onInstall(ctx);
        }
      }

      plugins.push({ name, methods });
      return val;
    });
  }

  async function remove(name) {
    await updateConfig(async (cfg) => {
      if (!cfg.plugins.find((x) => x.name === name)) {
        console.log(`plugin "${name} is not installed!`);
      } else {
        // remove Plugin
        console.log(`Removing plugin "${name}"...`);
        cfg.plugins = cfg.plugins.filter((x) => x.name !== name);

        // run onRemove method
        const plugin = plugins.find((x) => x.name === name);
        if (plugin?.methods.onRemove) {
          await plugin.methods.onRemove(ctx);
        }
      }

      // remove from local state
      plugins = plugins.filter((x) => x.name !== name);

      return cfg;
    });
  }

  async function start() {
    const config = getConfig();

    for (let plugin of plugins) {
      if (config.plugins.find((x) => x.name === plugin.name && x.active)) {
        if (plugin.methods.onStart) {
          console.log(`Starting plugin "${plugin.name}"...`);
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
              const targetPlugin = plugins.find((plug) => plug.name === name);
              if (targetPlugin.methods.onEnable) {
                targetPlugin.methods.onEnable();
              }
            }
          }

          return plugin;
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

              if (plugins[name] && plugins[name].methods.onDisable) {
                plugins[name].methods.onDisable();
              }
            }
          }
          return plugin;
        }),
      };
    });
  }

  async function loadPlugins(pluginFolder = getConfig().pluginDir) {
    if (!pluginFolder) {
      return console.log("no plugins directory is specified in config file");
    }
    let files = fs.readdirSync(pluginFolder, {
      encoding: "utf-8",
      withFileTypes: true,
    });
    await Promise.all(
      files.map(async (dirent) => {
        if (dirent.isDirectory()) {
          let rootpath = pathToFileURL(
            pluginFolder + "/" + dirent.name + "/index.js"
          );
          if (fs.existsSync(rootpath)) {
            const newPlugin = {
              name: dirent.name,
              methods: { ...(await import(rootpath)) },
            };
            plugins = [...plugins, newPlugin];
            console.log("plugin added");
          } else {
            return console.log(
              `${dirent.name} plugin should have a index.js root file`
            );
          }
        }
      })
    );
  }
  function getContext() {
    return ctx;
  }

  return {
    getContext,
    loadPlugins,
    install,
    remove,
    start,
    enable,
    disable,
  };
}
