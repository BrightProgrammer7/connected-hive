const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cadres = require("../models/cadres");
const historiquesCadres = require("../models/historiquesCadres");

// GET ALL CADRES

router.get("/cadres", secureApi, async (req, res) => {
  const limit = parseInt(req.query.limit || 0);
  const offset = parseInt(req.query.offset || 0);
  let sort = {};
  let query = {};

  if (req.query.filterBy) query = { ref: parseInt(req.query.filterBy) };

  try {
    const cadres = await Cadres.find(query)
      .sort(sort)
      .limit(limit)
      .skip(offset);
    const total_count = await cadres.countDocuments(query);
    if (!cadres.length) {
      return res.status(200).json({
        success: true,
        message: "NO CADRES FOUND",
      });
    }
    return res.status(200).json({
      total_count: total_count,
      data: cadres,
      success: true,
      message: "GET CADRES SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR GET ALL CADRES");
  }
});

//  GET CADRE BY ID

// router.get('/cadre/:id', secureApi, async (req, res) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return res.status(200).json({
//             success: false,
//             message: "INVALID ID"
//         })
//     }
//     try {
//         const cadre = await Cadres.findById(req.params.id);
//         if (!(cadre)) {
//             return res.status(200).json({
//                 success: false,
//                 message: "NO CADRE FOUND BY THIS ID"
//             })
//         }
//         return res.status(200).json({
//             data: cadre,
//             success: true,
//             message: "GET CADRE BY ID SUCCESSFULLY"
//         })
//     } catch (err) {
//         return res.status(400).json("ERREUR GET CADRE BY ID")
//     }
// });

// CREATE NEW CADRE

router.post("/cadre", secureApi, async (req, res) => {
  // if (!(await Cadres.findOne({}))){
  //     return res.status(200).json({
  //         success: false,
  //         message: "CADRE ALREADY EXISTE"
  //     })
  // }

  try {
    const cadre = new Cadres({
      ref: `CA${new Date().getTime()}${Math.floor(Math.random() * 90 + 10)}`,
      dateDepot: req.body.dateDepot,
      ciree: req.body.ciree,
      miel: req.body.miel,
      pollen: req.body.pollen,
      couvain: req.body.couvain,
      etatCadre: req.body.etatCadre,
    });
    await cadre.save();
    console.log("ara");
    return res.status(200).json({
      cadre: cadre,
      success: true,
      message: "CADRE CREATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR CREATE NEW CADRE");
  }
});

// UPDATE CADRE

router.patch("/cadre/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const cadre = await Cadres.findById({ _id: req.params.id });
    if (!cadre) {
      return res.status(200).json({
        success: false,
        message: "NO CADRE FOUND WITH THIS ID",
      });
    }

    for (let key in Object.keys(cadre)) {
      cadre[key] = req.body[key];
    }
    await cadre.save();
    return res.status(200).json({
      success: true,
      message: "CADRE UPDATED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR UPDATE CADRE");
  }
});

// UPDATE CADRE HISTORIQUE (ETAT CADRE)

router.post("/historiquesCadres/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const cadre = await Cadres.findById({ _id: req.params.id });
    if (!cadre) {
      return res.status(200).json({
        success: false,
        message: "NO CADRE FOUND WITH THIS ID",
      });
    }
    const historiqueCadre = new historiquesCadres({
      cadre: req.params.id,
      dateSortie: req.body.dateSortie,
      causeSortie: req.body.causeSortie,
      etat: req.body.etat,
    });

    await historiqueCadre.save();
    return res.status(200).json({
      data: historiqueCadre,
      success: true,
      message: "NEW HISTORIC ADDED SUCCESSFULLY",
    });
  } catch (err) {
    return res.status(400).json("ERREUR ADD NEW CADRE STATUS");
  }
});
// DELETE CADRE

router.delete("/cadre/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(200).json({
      success: false,
      message: "INVALID ID",
    });
  }
  try {
    const cadre = await Cadres.findById({ _id: req.params.id });
    if (!cadre) {
      return res.status(200).json({
        success: false,
        message: "NO CADRE FOUND BY THIS id",
      });
    }
    await cadre.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      message: "CADRE DELETED SUCCESSFULLY",
    });
  } catch (err) {
    res.status(400).json("ERREUR DELETE CADRE");
  }
});

module.exports = router;
