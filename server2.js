import express from "express";

import { Model, createTable, removeTable } from "@ulibs/db";

const app = express();
const { createTable } = require("./index/createTable");
const { Model } = require("./Model");

const Users = new Model("users");

app.post("/make_table", async (req, res) => {
  // ALL tables have id, created_at and updated_at (and maybe more fields)....
  await createTable("users", [
    { name: "name", type: "string", required: true },
    { name: "email", type: "string" },
    { name: "username", type: "string", unique: true },
  ]);
  res.send({ success: true });
});

app.post("/remove_table", async (req, res) => {
  await removeTable("users");
  res.send({ success: true });
});

app.get("/users", async (req, res) => {
  res.json(await Users.list({ where: { active: true } }));
});

app.get("/users/:id", async (req, res) => {
  res.json(await Users.get(id));
});

app.post("/users", async (req, res) => {
  res.json(
    await Users.create({
      name: "Some thing",
      email: "something@gmail.com",
      username: "something",
    })
  );
});

app.put("/users/:id", async (req, res) => {
  res.json(await Users.update(req.params.id, { username: "ssss" }));
});

app.delete("/users/:id", async (req, res) => {
  res.json(await Users.remove(req.params.id));
});

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
