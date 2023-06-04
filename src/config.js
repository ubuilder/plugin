import { readFileSync, writeFileSync } from "fs";

export function getConfig() {
  let content = readFileSync("./config.json", "utf-8");

  return JSON.parse(content);
}

export function setConfig(config) {
  let data = JSON.stringify(config);

  writeFileSync("./config.json", data);
}
