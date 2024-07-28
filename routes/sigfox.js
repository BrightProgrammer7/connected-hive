const express = require("express");
const router = express.Router();
const Sigfox = require("../models/sigfox");

router.post("/filterNames", secureApi, async (req, res) => {
  try {
    if (!req.body.length)
      return res.status(200).json({
        list: [],
        success: true,
        message: "NO NAME FOUND",
      });
    let list = [];
    for (const item of req.body)
      if (!(await Sigfox.findOne({ name: item }))) list.push(item);

    return res.status(200).json({
      list: list,
      success: true,
      message: "NAME FILTERED SUCCESSFULLY",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "FATAL ERROR",
    });
  }
});
module.exports = router;
