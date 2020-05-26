const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/login", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!!");
  }
});

router.post(
  "/login",
  [
    check("email", "Please enter a valid Email").isEmail(),
    check(
      "password",
      "Please enter a min 6 charaters in Password field"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ msg: "NE" });
      }
      const match = await bcrypt.compare(password, existingUser.password);
      if (!match) {
        return res.status(400).json({ msg: "NP" });
      }

      const payload = {
        user: {
          id: existingUser.id,
        },
      };

      jwt.sign(
        payload,
        config.get("Secret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.status(200).json({ token });
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
