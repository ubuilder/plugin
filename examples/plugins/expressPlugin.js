import express from "express";
import { BasePlugin } from "../classes/Plugin.js";

export class ExpressPlugin extends BasePlugin {
  onInit(ctx) {
    console.log("create new app");
    let app = express();

    ctx.getApp = () => app;

    ctx.addMiddleware = (handler) => {
      app.use(handler);
    };

    ctx.routes = {
      get(slug, handler) {
        app.get(slug, handler);
      },
      post(slug, handler) {
        app.post(slug, handler);
      },
      put(slug, handler) {
        app.put(slug, handler);
      },
      patch(slug, handler) {
        app.patch(slug, handler);
      },
      delete(slug, handler) {
        app.delete(slug, handler);
      },
    };

    const server = app.listen(3002, () => {
      console.log("listening on port 3002");
    });

    return () => {
      return new Promise((resolve) => {
        delete ctx.routes;
        delete ctx.getApp;
        delete ctx.addMiddleware;
        server.close((err) => {
          console.log({ err });
          resolve();
        });
      });
    };
  }
}
