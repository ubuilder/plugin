import { BasePlugin } from "../classes/Plugin.js";

export class TodosPlugin extends BasePlugin {
  onInit(ctx) {
    ctx.routes.get("/todos", (req, res) => {
      res.send("working");
    });
    console.log("todosPlugin onInit", ctx);
  }
}
