const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { createTable } = require("./index/createTable")
const { Model } = require('./Model')

app.post("/make_table",async (req, res)=>{
  await createTable('users', [
    { name: 'id', type: 'integer', autoIncrement: true},
    { name: 'name', type: 'string', required: true},
    { name: 'email', type: 'string'},
    { name: 'username', type: 'string', unique: true}
])
})

app.get("/users", async (req, res) => {
  const users = await Model("users")
  res.json(users.index());
});

app.get("/users/:id", async (req, res) => {
  const user = await Model('users')
  
  res.json(user.findById(id));
});

app.post("/users", async (req, res) => {
  const user = await Model('users')

  res.json(user.create({user_name: "something"}));
});

app.put("/users/:id", async (req, res) => {
  const user = await Model('users')

  res.json(user.update(req.params.id, {user_name: "ssss"}));
});

app.delete("/users/:id", async (req, res) => {
  const user = await Model('users')

  res.json(user.delete(req.params.id));
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
