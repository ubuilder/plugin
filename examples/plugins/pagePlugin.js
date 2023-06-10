import { BasePlugin } from "../classes/Plugin.js";

export class PagesPlugin extends BasePlugin {
  onInit(ctx) {
    ctx.addPage = "test add page";
    console.log("pagesPlugin onInit", ctx);
  }
}