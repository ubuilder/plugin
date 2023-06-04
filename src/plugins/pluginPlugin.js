import { BasePlugin } from "../classes/Plugin.js";

export class PluginsPlugin extends BasePlugin {
    onInit(ctx) {
      ctx.routes.get("/disable", (req, res) => {
        const config = getConfig();
  
        config.todos = false;
        setConfig(config);
  
        res.send("Todos plugin disabled");
      });
  
      ctx.routes.get("/enable", (req, res) => {
        const config = getConfig();
  
        config.todos = true;
        setConfig(config);
  
        res.send("Todos plugin enabled");
      });
  
      ctx.routes.get("/restart", (req, res) => {
        ctx.restart(getConfig());
      });
    }
  }