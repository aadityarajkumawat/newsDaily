const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const browsingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  query: String,
  page: String,
});

module.exports = mongoose.model("Browsing", browsingSchema);
