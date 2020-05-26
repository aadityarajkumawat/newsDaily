const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 6,
  },
  phone: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
