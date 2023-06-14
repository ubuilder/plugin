import fs from "fs";
import test from "ava";
import { PluginManager } from "../src/PluginManager.js";

test("create pluginManager instance", (t) => {
  const pm = PluginManager();

  t.truthy(pm.start);
  t.truthy(pm.install);
  t.truthy(pm.remove);
  t.truthy(pm.enable);
  t.truthy(pm.disable);
});

test("should install plugin", async (t) => {
  if (fs.existsSync("./test-1.json")) {
    fs.rmSync("./test-1.json");
  }

  const pm = PluginManager({
    config: "test-1.json",
  });

  await pm.install("test", {
    onInstall() {
      t.pass();
    },
  });

  await pm.remove("test");
});

test("should have correct ctx for install", async (t) => {
  if (fs.existsSync("./test-2.json")) {
    fs.rmSync("./test-2.json");
  }

  const pm = PluginManager({
    config: "test-2.json",
    ctx: { field1: 302, field2: "field2" },
  });

  await pm.install("test-1", {
    onInstall(ctx) {
      t.deepEqual(ctx.field1, 302);
      t.deepEqual(ctx.field2, "field2");
    },
  });

  await pm.remove("test-1");
});

test("should have ctx for remove", async (t) => {
  if (fs.existsSync("test-3.json")) {
    fs.rmSync("test-3.json");
  }

  const pm = PluginManager({
    config: "test-3.json",
    ctx: { field1: 302, field2: "field2" },
  });

  await pm.install("test-2", {
    onRemove(ctx) {
      t.deepEqual(ctx, { field1: 302, field2: "field2" });
    },
  });

  await pm.remove("test-2");
});

test("should have initial ctx for start", async (t) => {
  if (fs.existsSync("./test-4.json")) {
    fs.rmSync("./test-4.json");
  }

  const pm = PluginManager({
    config: "test-4.json",
    ctx: { field1: 302, field2: "field2" },
  });

  await pm.install("test-3", {
    onStart(ctx) {
      t.deepEqual(ctx.field1, 302);
      t.deepEqual(ctx.field2, "field2");
    },
  });

  await pm.start();

  pm.remove("test-3");
});

test("should not run onInstall of an installed plugin", async (t) => {
  if (fs.existsSync("./test-5.json")) {
    fs.rmSync("./test-5.json");
  }

  const pm = PluginManager({
    config: "test-5.json",
  });

  await pm.install("test-4", {
    onInstall(ctx) {
      //
      t.pass();
    },
  });

  await pm.install("test-4", {
    onInstall(ctx) {
      //
      t.fail();
    },
  });

  await pm.remove("test-4");
});

test("enable/disable plugins should work", async (t) => {
  if (fs.existsSync("./test-6.json")) {
    fs.rmSync("./test-6.json");
  }

  const pm = PluginManager({
    config: "test-6.json",
  });

  await pm.install("test-5", {
    onStart(ctx) {
      t.fail();
    },
  });

  await pm.install("test-51", {
    onStart(ctx) {
      t.pass();
    },
  });

  await pm.disable("test-5");
  await pm.start();

  await pm.remove("test-5");
  await pm.remove("test-51");
});

test("should work everything", async (t) => {
  if (fs.existsSync("./test-7.json")) {
    fs.rmSync("./test-7.json");
  }

  const pm = PluginManager({
    config: "test-7.json",
    ctx: { abc: 123 },
  });

  await pm.install("plugin-1", {
    onInstall(ctx) {
      t.deepEqual(ctx, { abc: 123 });
      //
    },
    onRemove(ctx) {
      t.deepEqual(ctx, { abc: 123, def: 456 });
      t.pass();
      delete ctx["def"];
      //
    },
    onStart(ctx) {
      t.deepEqual(ctx, { abc: 123 });
      ctx.def = 456;
    },
    onEnable(ctx) {
      t.deepEqual(ctx, { abc: 123 });
    },
    onDisable(ctx) {
      t.deepEqual(ctx, { abc: 123 });
    },
  });

  await pm.install("plugin-2", {
    onInstall(ctx) {
      t.deepEqual(ctx, { abc: 123 });
      //
    },
    onRemove(ctx) {
      t.deepEqual(ctx, { abc: 123 });
      t.pass();
      //
    },
    onStart(ctx) {
      t.deepEqual(ctx, { abc: 123, def: 456 });
    },
    onEnable(ctx) {
      t.deepEqual(ctx, { abc: 123 });
    },
    onDisable(ctx) {
      t.deepEqual(ctx, { abc: 123 });
    },
  });

  // should not run onInstall of installed plugin
  await pm.install("plugin-1", {
    onInstall() {
      t.fail();
    },
  });

  await pm.start();

  await pm.remove("plugin-1");
  await pm.remove("plugin-2");
});