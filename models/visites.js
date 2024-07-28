const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VisitesSchema = mongoose.Schema({
  ref: {
    type: String,
    required: true,
  },
  rucher: {
    type: Schema.Types.ObjectId,
    ref: "ruchers",
    required: true,
  },
  ruches: [
    {
      type: Schema.Types.ObjectId,
      ref: "ruches",
      required: true,
    },
  ],
  dateVisite: {
    type: Date,
    required: true,
  },
  cr: {
    type: String,
    required: true,
  },
  nourriture: {
    type: String,
    required: true,
  },
  ponteJour: {
    type: String,
    required: true,
  },
  presenceCR: {
    type: String,
    required: true,
  },
  forceColonie: {
    type: Number,
    required: true,
  },
  comportement: {
    type: String,
    required: true,
  },
  tailleCouvain: {
    type: Number,
    required: true,
  },
  nbrVaroa: {
    type: Number,
    required: true,
  },
  commentaire: {
    type: String,
  },
  actionRealisee: {
    type: String,
    required: true,
  },
  actionPrevue: {
    type: String,
    required: true,
  },
  etatRuche: {
    type: String,
    required: true,
  },
  poids: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("visites", VisitesSchema);
