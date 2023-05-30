import express from "express";
const PORT = process.env.PORT || 3001;
const app = express();
import { connect } from "../src/connect.js";

const config = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ubuilder",
    charset: "utf8",
  },
  // migrations: {
  //   directory: __dirname + '/knex/migrations',
  // },
  // seeds: {
  //   directory: __dirname + '/knex/seeds'
  // }
};

const { Model, createTable, removeTable } = connect(config);

const Users = Model("users");

app.use(express.json());

app.post("/make_table", async (req, res) => {
  // await createTable(,);

  res.send("success");
});

app.post("/remove_table", async (req, res) => {
  await removeTable("users_2");
  res.send({ success: true });
});


app.get("/users", async (req, res) => {
  res.json(await Users.query({
    where: {user_name: "sis"},
    sort: {column: "user_name", order: "desc"},
    select: ["id", "user_name"],
    // page: 2,
    perPage: 10
  }));
});

app.get("/users/:id", async (req, res) => {
  res.json(await Users.get(req.params.id));
});

app.post("/users", async (req, res) => {
  console.log('CREATE USER')
  console.log(req.body)
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
