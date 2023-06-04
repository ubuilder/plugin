export class BasePlugin {
  onInit(ctx) {
    console.log("plugin on Init", ctx);
  }

  onBuild(ctx) {
    console.log("plugin on build", ctx);
  }

  onActive() {
    console.log("activated");
  }

  onDisable() {
    console.log("onDisabled");
  }
}
