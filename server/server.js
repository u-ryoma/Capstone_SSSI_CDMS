const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("ryodb");
  console.log("Connected to MongoDB");
}
connectDB();

// ==========================
// HEARTBEAT
// ==========================
const heartbeats = {};

app.post("/api/heartbeat", (req, res) => {
  const { username } = req.body;
  heartbeats[username] = Date.now();
  res.json({ success: true });
});

app.get("/api/active-users", (req, res) => {
  const now = Date.now();
  const activeUsers = Object.entries(heartbeats)
    .filter(([_, lastSeen]) => now - lastSeen < 60000)
    .map(([username]) => username);
  res.json(activeUsers);
});

// ==========================
// LOGOUT - clears heartbeat
// ==========================
app.post("/api/logout", (req, res) => {
  const { username } = req.body;
  delete heartbeats[username];
  res.json({ success: true });
});

// ==========================
// LOGIN
// ==========================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ username });
    if (!user) return res.json({ success: false });
    if (user.password === password) {
      heartbeats[username] = Date.now();
      res.json({
        success: true,
        username: user.username,
        role: user.role,
        name: user.name,
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ==========================
// LOGS
// ==========================
app.post("/api/logs", async (req, res) => {
  try {
    const { username, name, role, action, timestamp } = req.body;
    await db.collection("logs").insertOne({
      username,
      name,
      role,
      action,
      timestamp: timestamp || new Date().toISOString(),
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await db
      .collection("logs")
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).send("Error fetching logs");
  }
});

// ==========================
// ACCOUNTS
// ==========================
app.post("/api/register", async (req, res) => {
  const { username, name, password, role } = req.body;
  try {
    const existing = await db.collection("users").findOne({ username });
    if (existing)
      return res.json({ success: false, message: "Username already exists" });
    await db.collection("users").insertOne({
      username,
      name,
      password,
      role,
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await db.collection("users").find().toArray();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/accounts/:id", async (req, res) => {
  const { username, name, role, password } = req.body;
  try {
    const updateData = { username, name, role };
    if (password) updateData.password = password;
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
    res.json({ success: true, message: "Account updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

app.delete("/api/accounts/:id", async (req, res) => {
  try {
    await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
