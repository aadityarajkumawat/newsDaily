const router = require("express").Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Browsing = require("../models/Browsing");

router.post(
  "/register",
  [
    check("username", "Please enter username").not().isEmpty(),
    check("email", "Please enter your email address").isEmail(),
    check("password", "Please enter min 6 charcters for password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const Errors = validationResult(req);

    if (!Errors.isEmpty()) {
      console.log("found");
      return res.status(400).json({ errors: Errors.array() });
    }
    const { username, email, password, phone } = req.body;
    try {
      let validator = {
        noEmail: false,
        noUsername: false,
        noPhone: false,
      };

      let newUser = await User.findOne({ email });
      if (newUser) {
        validator.noEmail = true;
        console.log(6);
        return res.status(400).json({ msg: "Invalid Email" });
      }
      newUser = await User.findOne({ username });
      if (newUser) {
        validator.noUsername = true;
        console.log(5);
        return res.status(400).json({ msg: "Invalid Username" });
      }
      newUser = await User.findOne({ phone });
      if (newUser) {
        validator.noPhone = true;
        console.log(4);
        return res.status(400).json({ msg: "Invalid Phone" });
      }
      if (!validator.noEmail && !validator.noUsername && !validator.noPhone) {
        const salt = await bcrypt.genSalt(10);
        newUser = new User({
          username,
          email,
          password,
          phone,
        });
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword;

        await newUser.save();

        const browsingD = new Browsing({
          query: "",
          page: "",
          user: newUser.id,
        });

        await browsingD.save();

        const payload = {
          user: {
            id: newUser.id,
          },
        };
        jwt.sign(
          payload,
          config.get("Secret"),
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) {
              console.log("wtf");
              throw err;
            }
            res.json({ token });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("ERRORS!!");
    }
  }
);

module.exports = router;
