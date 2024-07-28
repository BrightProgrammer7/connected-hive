const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RuchersSchema = mongoose.Schema({
  ref: {
    type: String,
    required: true,
  },
  externalId: {
    type: Number,
  },
  localisation: {
    type: String,
    required: true,
  },
  ruches: [
    {
      type: Schema.Types.ObjectId,
      ref: "ruches",
    },
  ],
});

module.exports = mongoose.model("ruchers", RuchersSchema);
