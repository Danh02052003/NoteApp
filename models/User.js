const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, requre: true, unique: true },
    password: { type: String, requre: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
