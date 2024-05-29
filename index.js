const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
  <ul>
      ${users.map((user) => `<li>${user.first_name}<li/>`).join("")}
  </ul>
    `;
  return res.send(html);
});

//  routes
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find((user) => Number(user.id) === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  })
  .patch((req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updateData = req.body;

    const user = users.find((user) => Number(user.id) === userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    res.json(user);
  })
  .delete((req, res) => {
    const userId = parseInt(req.params.id,10);
    const user = users.find( (user) => Number(user.id)===userId);

    if(user=== -1)
      {
        console.log("user not found");
        return res.status(404).json({ error: "user not found"});
      }

      const deleteuser = users.splice(user, 1);
      return res.json(deleteuser);

  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`Server has started at port no ${PORT}`);
});
