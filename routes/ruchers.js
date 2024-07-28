const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ruchers = require("../models/ruchers");

// GET ALL RUCHER

router.get("/ruchers", secureApi, async (req, res) => {
  const limit = parseInt(req.query.limit || 0);
  const offset = parseInt(req.query.offset || 0);
  let sort = {};
  let query = {};

  if (req.query.filterBy) query = { ref: parseInt(req.query.filterBy) };

  try {
    const ruchers = await Ruchers.find(query)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .populate({ path: "ruches", populate: { path: "cadres reine" } });
    const total_count = await Ruchers.countDocuments();
    if (!ruchers.length) {
      return res.status(200).json({
        success: false,
        message: "0 Rucher trouver",
      });
    }
    return res.status(200).json({
      total_count: total_count,
      ruchers: ruchers,
      success: true,
      message: "GET RUCHERS SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Erreur de récupération des fichers",
    });
  }
});

// GET RUCHERS BY ID

router.get("/rucher/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.rucher_id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }
  const limit = parseInt(req.query.limit || 0);
  const offset = parseInt(req.query.offset || 0);
  let sort = {};
  let query = {};

  if (req.query.filterBy) query = { ref: parseInt(req.query.filterBy) };
  try {
    const rucher = await Ruchers.findById({
      $in: { _id: req.params.rucher_id },
    })
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .populate({ path: "ruches", populate: { path: "cadres reine" } });
    return res.status(200).json({
      rucher: rucher,
      success: true,
      message: "GET RUCHE BY RUCHER SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR GET RUCHE BY REUCHER");
  }
});

// CREATE NEW RUCHER

router.post("/rucher", secureApi, async (req, res) => {
  // if (!(await Ruchers.findOne({ externalId: req.body.externalId })))
  //   return res.status(200).json({
  //     success: false,
  //     message: "Ruche existe déjà",
  //   });
  try {
    const ref = `EN${new Date().getTime()}${Math.floor(
      Math.random() * 90 + 10
    )}`;
    const rucher = new Ruchers({
      ref: ref.replace(/ /g, ""),
      externalId: req.body.externalId,
      localisation: req.body.localisation,
      ruches: req.body.ruche,
    });
    await rucher.save();
    return res.status(200).json({
      data: rucher,
      success: true,
      message: "RUCHER CREATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "ERREUR CREATE NEW RUCHER",
    });
  }
});

// UPDATE RUCHER

router.patch("/rucher/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }

  try {
    const rucher = await Ruchers.findById({ _id: req.params.id });
    if (!rucher) {
      return res.status(200).json({
        success: false,
        message: "NO RUCHER FOUND",
      });
    }
    for (let key in Object.keys(rucher)) {
      rucher[key] = req.body[key];
    }
    await rucher.save();
    return res.status(200).json({
      data: rucher,
      success: true,
      message: "RUCHER UPDATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR UPDATE RUCHER");
  }
});

// DELETE RUCHER

router.delete("/rucher/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const rucher = await Ruchers.findById(req.params.id);
    if (!rucher) {
      return res.status(200).json({
        success: false,
        message: "NO RUCHER FOUND BY THIS id",
      });
    }
    await rucher.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      message: "RUCHER DELETED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR DELETE RUCHER");
  }
});

module.exports = router;
