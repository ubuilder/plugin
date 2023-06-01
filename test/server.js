import express from "express";
const PORT = process.env.PORT || 3001;
const app = express();
import { connect } from "../src/connect.js";

const { getModel, createTable, removeTable } = connect({
  filename: ":memory:",
  client: "sqlite3",
});

await createTable("test", {
  name: "string|required|default=No Name",
  username: "string|required",
  age: "number|required|default=0",
  email: "string|required",
});

const Test = getModel("test");

await Test.insert({
  name: "hadi",
  username: "thehadiahmadi",
  age: 21,
  email: "thehadiahmadi@gmail.com",
});

await Test.insert({
  name: "edriass",
  username: "edrissAria",
  age: 23,
  email: "edrisssaria@gmail.com",
});
await Test.insert({
  name: "jawad",
  username: "jawadAzizi",
  age: 22,
  email: "jawad.Azizi@gmail.com",
});

const filteredUsers = await Test.query({
  where: {
    name: "a:like",
    age: "22:<=",
    email: "gmail:like",
  },
});

console.log(filteredUsers);

const Users = getModel("users");

app.use(express.json());

app.post("/make_table", async (req, res) => {
  // await createTable(,);
  await createTable("users", [{ name: "user_name", type: "string" }]);
  res.send("success");
});

app.post("/remove_table", async (req, res) => {
  await removeTable("users_2");
  res.send({ success: true });
});

app.get("/users", async (req, res) => {
  res.json(
    await Users.query({
      where: {
        // active: true,
        user_name: "ss:like",
        // user_name: "edriss:!=",
        // user_name: null
      },
      // sort: {column: "user_name", order: "desc"},
      // select: ["id", "user_name"],
      page: 1,
      // perPage: 1
    })
  );
});

app.get("/users/:id", async (req, res) => {
  res.json(await Users.get(req.params.id));
});

app.post("/users", async (req, res) => {
  console.log("CREATE USER");
  console.log(req.body);
  res.json(await Users.insert(req.body));
});

app.put("/users/:id", async (req, res) => {
  res.json(await Users.update(req.params.id, { user_name: "ssss" }));
});

app.delete("/users/:id", async (req, res) => {
  res.json(await Users.remove(req.params.id));
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
