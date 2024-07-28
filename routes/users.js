const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const uuidv4 = require("uuid/v4");

// Create user route post
router.post("/user", async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    return res.status(200).json({
      input: "email",
      success: false,
      message: "There is an existing user with that email address",
    });
  }

  try {
    //? HASH PASSWORD

    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      numTel: req.body.numTel,
      validationToken: uuidv4(),
    });

    await user.save();
    return res.status(201).json({
      user: user,
      success: true,
      message: `Bienvenue ${user.firstname} ${user.lastname}  !`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

// Get user by id

router.get("/user/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });

  if (req.decodedToken.user.id != req.params.id)
    return res
      .status(403)
      .json({ success: false, message: "USERS CANNOT GET OTHER USERS" });

  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(204).json({
        success: false,
        message: "NO USER FOUND",
      });

    delete user["password"];
    delete user["created_at"];

    return res.status(200).json({
      user: user,
      success: true,
      message: "GET USER BY ID SUCCESSFUL",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

// UPDATE A SINGLE USER

router.patch("/user/:id", secureApi, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body._id) || !req.body._id)
    return res.status(400).json({
      success: false,
      message: "INVALID ID",
    });

  if (req.decodedToken.user.id != req.body._id)
    return res
      .status(403)
      .json({ success: false, message: "USERS CANNOT UPDATE OTHER USERS" });

  delete req.body["email"];
  try {
    let user = await User.findById(req.body._id);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "NO USER FOUND",
      });

    //   Parse body fields
    for (let key of Object.keys(req.body)) user[key] = req.body[key];

    await user.save();

    return res.status(200).json({
      success: true,
      message: "USER UPDATED SUCCESSFULLY",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
