const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReinesSchema = mongoose.Schema({
  ref: {
    type: String,
    required: true
  },
  codeGen: {
    type: String,
    required: true,
  },
  marquee: {
    type: String,
    required: true,
  },
  clippe: {
    type: String,
    required: true,
  },
  dateNaissance: {
    type: Date,
    required: true,
  },
});

// ref : `RE${new Date.getTime()}${Math.floor(Math.random() * (99 - 10 + 1) + 10)}`,

module.exports = mongoose.model("reines", ReinesSchema);
