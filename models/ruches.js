const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RuchesSchema = mongoose.Schema({
  ref: {
    type: String,
    required: true,
  },
  externalId: {
    type: Number,
  },
  typeRuche: {
    type: String,
    required: true,
  },
  rucher: {
    type: Schema.Types.ObjectId,
    ref: "ruchers",
    required: true,
  },
  reine: {
    type: Schema.Types.ObjectId,
    ref: "reines",
    required: true,
  },
  cadres: [
    {
      type: Schema.Types.ObjectId,
      ref: "cadres",
    },
  ],
  debutService: {
    type: Date,
    required: true,
  },
  hausse: {
    type: String,
    required: true,
  },
  grilleReine: {
    type: String,
    required: true,
  },
  plaqueFont: {
    type: String,
    required: true,
  },
  nourrisseur: {
    type: String,
    required: true,
  },
});
RuchesSchema.pre("deleteOne", async function (next) {
  const Sigfox = require("./sigfox");
  let relation = await Sigfox.findOne({ ruche: this._id });
  if (relation) await relation.remove();
  next();
});
RuchesSchema.pre("save", async function (next) {
  const Ruchers = require("./ruchers");
  let rucher = await Ruchers.findById(this.rucher);
  rucher.ruches.push(this._id);
  await rucher.save();
  next();
});

module.exports = mongoose.model("ruches", RuchesSchema);
