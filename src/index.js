// src/index.js
const express = require("express");
const { randomUUID } = require("crypto");

const app = express();
app.use(express.json());

// In-memory store
const users = [];

/**
 * POST /users
 * Body: { name, email }
 * 201 -> created user
 * 400 -> missing fields
 */
app.post("/users", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const user = { id: randomUUID(), name, email };
  users.push(user);
  return res.status(201).json(user);
});

/**
 * GET /users/:id
 * 200 -> user
 * 404 -> not found
 */
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(user);
});

/**
 * PUT /users/:id
 * Body: { name, email }
 * 200 -> updated user
 * 400 -> missing fields
 * 404 -> not found
 */
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[idx] = { ...users[idx], name, email };
  return res.status(200).json(users[idx]);
});

/**
 * DELETE /users/:id
 * 204 -> deleted
 * 404 -> not found
 */
app.delete("/users/:id", (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users.splice(idx, 1);
  return res.status(204).send();
});

// Export for tests
module.exports = app;

// Allow `node src/index.js` to run a server for manual testing
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
