const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SigfoxSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ruche: {
    type: Schema.Types.ObjectId,
    ref: "ruches",
    required: true,
  },
});

module.exports = mongoose.model("sigfox", SigfoxSchema);
