const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CadreSchema = mongoose.Schema({
  ref: {
    type: String,
    required: true,
  },
  dateDepot: {
    type: Date,
    required: true,
  },
  ciree: {
    type: String,
    required: true,
  },
  miel: {
    type: String,
    required: true,
  },
  pollen: {
    type: String,
    required: true,
  },
  couvain: {
    type: String,
    required: true,
  },
  etatCadre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("cadres", CadreSchema);
