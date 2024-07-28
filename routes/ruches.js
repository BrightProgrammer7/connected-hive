const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ruches = require("../models/ruches");
const Reines = require("../models/reines");
const Cadres = require("../models/cadres");
const Sigfox = require("../models/sigfox");

// Create new RUCHE

router.post("/ruche", secureApi, async (req, res) => {
  // if (!(await Ruches.findOne({ externalId: req.body.externalId })))
  //     return res.status(200).json({
  //         success: false,
  //         message: 'Ruche existe déjà'
  //     });
  console.log(req.body);
  try {
    let date = new Date(req.body.reine.dateNaissance);
    const reine = new Reines({
      ref: `RE${new Date().getTime()}${Math.floor(Math.random() * 90 + 10)}`,
      codeGen: req.body.reine.codeGen,
      marquee: req.body.reine.marquee,
      clippe: req.body.reine.clippe,
      dateNaissance: date,
    });

    console.log(reine);

    await reine.save();

    let ruche_cadre = [];
    for (const cadre of req.body.cadres) {
      let created_cadre = new Cadres({
        ref: `CA${new Date().getTime()}${Math.floor(Math.random() * 90 + 10)}`,
        dateDepot: cadre.dateDepot,
        ciree: cadre.ciree,
        miel: cadre.miel,
        pollen: cadre.pollen,
        couvain: cadre.couvain,
        etatCadre: cadre.etatCadre,
      });
      await created_cadre.save();
      ruche_cadre.push(created_cadre._id);
    }

    const ruche = new Ruches({
      ref: `RU${new Date().getTime()}${Math.floor(Math.random() * 90 + 10)}`,
      //externalId: req.body.externalId,
      typeRuche: req.body.typeRuche,
      rucher: req.body.rucher,
      reine: reine._id,
      cadres: ruche_cadre,
      debutService: req.body.debutService,
      hausse: req.body.hausse,
      grilleReine: req.body.grilleReine,
      plaqueFont: req.body.plaqueFont,
      nourrisseur: req.body.nourrisseur,
    });

    console.log(ruche);
    let created_ruche = await ruche.save();

    const relation = new Sigfox({
      name: req.body.feedName,
      ruche: created_ruche._id,
    });
    await relation.save();

    return res.status(200).json({
      data: ruche,
      success: true,
      message: "Ruche céer avec succès",
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "Erreur lors de la création de votre ruche",
    });
  }
});

// GET ALL

router.get("/ruches", secureApi, async (req, res) => {
  if (
    !req.query.rucher_id ||
    !mongoose.Types.ObjectId.isValid(req.query.rucher_id)
  ) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const ruches = await Ruches.find({ rucher: req.query.rucher_id }).populate(
      "reine cadres"
    );
    return res.status(200).json({
      ruches: ruches,
      success: true,
      message: "GET RUCHES SUCCESSFULLY",
    });
  } catch (error) {
    return res.status(400).json("ERREUR GET ALL RUCHES");
  }
});

// GET RUCHE BY id

// router.get('/ruche/:id', secureApi, async (req, res) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return res.status(400).json({
//             success: false,
//             message: "INVALID ID",
//         });
//     }
//     try {
//         const ruches = await Ruches.findById({ _id: req.params.id });
//         if (!(ruches)) {
//             return res.status(200).json({
//                 success: false,
//                 message: "NO RUCHE FOUND"
//             })
//         }
//         return res.status(200).json({
//             data: ruches,
//             success: true,
//             message: "GET RUCHE BY id SUCCESSFULLY"
//         })
//     } catch (err) {
//         return res.status(400).json("ERREUR GET RUCHE BY id");
//     }
// });

// UPDATE RUCHE

router.patch("/ruche/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }

  try {
    const ruche = await Ruches.findById({ _id: req.params.id });
    if (!ruche) {
      return res.status(200).json({
        success: false,
        message: "NO RUCHE FOUND",
      });
    }
    for (let key of Object.keys(req.body)) {
      ruche[key] = req.body[key];
    }
    await ruche.save();
    return res.status(200).json({
      data: ruche,
      success: true,
      message: "RUCHE UPDATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR UPDATE RUCHE");
  }
});

// DELETE RUCHE

router.delete("/ruche/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const ruche = await Ruches.findById(req.params.id);
    if (!ruche) {
      return res.status(200).json({
        success: false,
        message: "NO RUCHE FOUND BY THIS id",
      });
    }

    await ruche.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      message: "RUCHE DELETED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR DELETE RUCHE");
  }
});

module.exports = router;
