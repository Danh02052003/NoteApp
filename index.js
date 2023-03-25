const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Notes");
const User = require("./models/User");
const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded());
const port = 3000;
MONGODB_URI =
  "mongodb+srv://danhnguyen:soliknokia@cluster0.n5zpf7b.mongodb.net/test";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

//Endpoints to serve the HTML
app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
});

//Endpoints APIs
app.post("/getnotes", async (req, res) => {
  let notes = await Note.find({ email: req.body.email });
  res.status(200).json({
    success: true,
    notes,
  });
});

app.post("/login", async (req, res) => {
  let user = await User.findOne(req.body);
  console.log(user);
  if (!user) {
    res.status(200).json({ success: false, message: "No user found" });
  } else {
    res.status(200).json({
      success: true,
      user: { email: user.email },
      message: "User found",
    });
  }
});

app.post("/signup", async (req, res) => {
  const { userToken } = req.body;
  console.log(req.body);
  let user = await User.create(req.body);
  res.status(200).json({ success: true, user: user });
});

app.post("/addnote", async (req, res) => {
  const { userToken } = req.body;
  let note = await Note.create(req.body);
  res.status(200).json({ success: true, note });
});

app.post("/updatenote", async (req, res) => {
  const { userToken } = req.body;
  const noteId = req.body.noteId;
  const newNote = req.body.newNote;
  let note = await Note.findById(noteId);
  note.desc = newNote; // replace the old 'desc' with the new one
  note.save();
  res.status(200).json({ success: true, note });
});

app.post("/deletenote", async (req, res) => {
  const { userToken, noteId } = req.body;

  try {
    const deletedNote = await Note.deleteOne({ _id: noteId });
    if (deletedNote.deletedCount === 0) {
      res.status(404).json({ success: false, message: "Note not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Note deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost${port}`);
});
