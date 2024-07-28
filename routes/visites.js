const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Visites = require("../models/visites");

// GET ALL VISITES

router.get("/visites", secureApi, async (req, res) => {
  const limit = parseInt(req.query.limit || 0);
  const offset = parseInt(req.query.offset || 0);
  let sort = {};
  let query = {};

  if (req.query.filterBy) query = { ref: parseInt(req.query.filterBy) };

  try {
    const visites = await Visites.find(query)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .populate("rucher");
    //const total_count = await visites.countDocuments(query);
    if (!visites.length) {
      return res.status(200).json({
        success: false,
        message: "NO VISITES FOUND",
      });
    }
    return res.status(200).json({
      //total_count: total_count,
      visites: visites,
      success: true,
      message: "GET VISITES SUCCESSFULLY",
    });
  } catch (err) {
    return res
      .status(200)
      .json({ success: false, message: "ERREUR GET ALL VISITES" });
  }
});

// GET VISITES BY id

router.get("/visite/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      success: false,
      message: "Id invalide",
    });
  }
  try {
    const visite = await Visites.findById({ _id: req.params.id });
    if (!visite) {
      return res.status(200).json({
        success: false,
        message: "La visite demandée n'existe pas",
      });
    }
    return res.status(200).json({
      data: visite,
      success: true,
      message: "GET VISITE BY ID SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR GET VISITE BY ID");
  }
});

// CREATE NEW VISITE

router.post("/visite", secureApi, async (req, res) => {
  console.log(req.body);
  try {
    const visite = new Visites({
      ref: `VI${new Date().getTime()}${Math.floor(
        Math.random() * (99 - 10 + 1) + 10
      )}`,
      ruches: req.body.ruches,
      dateVisite: req.body.dateVisite,
      cr: req.body.cr,
      nourriture: req.body.nourriture,
      ponteJour: req.body.ponteJour,
      presenceCR: req.body.presenceCR,
      forceColonie: req.body.forceColonie,
      comportement: req.body.comportement,
      tailleCouvain: req.body.tailleCouvain,
      nbrVaroa: req.body.nbrVaroa,
      commentaire: req.body.commentaire,
      actionRealisee: req.body.actionRealisee,
      actionPrevue: req.body.actionPrevue,
      etatRuche: req.body.etatRuche,
      poids: req.body.poids,
      rucher: req.body.rucher,
    });

    await visite.save();
    return res.status(201).json({
      visite: visite,
      message: "VISITE CREATED SUCCESSFULLY",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("ERREUR CREATE NEW VISITE");
  }
});

// UPDATE VISITES

router.patch("/visite/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      success: false,
      message: "INVALID ID",
    });
  }

  try {
    const visite = await Visites.findById({ _id: req.params.id });
    if (!visite) {
      return res.status(200).json({
        success: false,
        message: "Visite not found",
      });
    }

    for (let key in Object.keys(visite)) {
      visite[key] = req.body[key];
    }
    await visite.save();
    return res.status(200).json({
      data: visite,
      success: true,
      message: "VISITE UPDATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR UPDATE VISITE");
  }
});

// DELETE VISITES

router.delete("/visite/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const visite = await Visites.findById(req.params.id);
    if (!visite) {
      return res.status(200).json({
        success: false,
        message: "NO VISITE FOUND BY id",
      });
    }
    await visite.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      message: "VISITE DELETED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR DELETE VISITE");
  }
});
module.exports = router;
