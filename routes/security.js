let express = require("express");
require("dotenv").config();
let router = express.Router();
let jwt = require("jsonwebtoken");
let bcryptjs = require("bcryptjs");
let User = require("../models/users");

router.post("/login", async function (req, res) {
  // ? CATCH ERROR IF NO REQ.BODY
  if (!req.body.password || !req.body.email)
    return res.status(200).json({
      success: false,
      message: "Bad request",
    });

  let user = await User.findOne({ email: req.body.email });

  // ? CHECKING IF USER EXISTS
  if (!user)
    return res.status(200).json({
      input: "email",
      success: false,
      type: "credentials",
      message: "No user found for " + req.body.email + ".",
    });
  // ? COMPARE PASSWORD
  bcryptjs.compare(
    req.body.password,
    user.password,
    async function (err, isMatch) {
      if (err) return res.status(500).json({ error: err });
      if (isMatch) {
        // ? CORRECT LOGIN
        let token = jwt.sign(
          {
            user: {
              fullname: `${user.firstname} ${user.lastname}`,
              email: user.email,
              id: user.id,
              validationToken: user.validationToken,
            },
          },
          process.env.TOKEN_SECRET,
          {}
        );
        return res.status(200).json({
          success: true,
          token: token,
          user: {
            fullname: `${user.firstname} ${user.lastname}`,
            email: user.email,
            id: user.id,
            validationToken: user.validationToken,
          },
        });
      } else {
        // ? WRONG PASSWORD
        return res.status(200).json({
          input: "password",
          success: false,
          type: "credentials",
          message: "Invalid password, please try again",
        });
      }
    }
  );
});

router.post("/checkRoute", function (req, res) {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la vérification du jeton.",
          });
        } else {
          let user = await User.findById(
            decoded.user.id,
            "email _id validationToken"
          );
          if (!user)
            return res.status(403).json({
              success: false,
              message: "Token is valid but user is not in the DB anymore",
            });
          if (
            user.validationToken.toString() !==
            decoded.user.validationToken.toString()
          )
            return res.status(403).json({
              success: false,
              message: "Token is valid but password has changed",
            });

          return res.status(200).json({
            token: req.headers.authorization,
            user,
          });
        }
      }
    );
  } else {
    // No token
    console.log("No token");
    return res.status(403).json({ success: false, msg: "Token not found" });
  }
});

global.secureApi = function (req, res, next) {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.TOKEN_SECRET,
      function (Err, decoded) {
        if (Err) {
          return res.status(403).send("Invalid token");
        } else {
          req.decodedToken = decoded;
          next();
        }
      }
    );
  } else {
    return res.status(403).send("Invalid token");
  }
};

module.exports = router;
