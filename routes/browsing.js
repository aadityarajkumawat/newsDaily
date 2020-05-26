const router = require("express").Router();
const auth = require("../middleware/auth");
const Browsing = require("../models/Browsing");
const User = require("../models/User");

router.put("/", auth, async (req, res) => {
  const { query, page } = req.body;
  const toBeUpdated = { query, page };
  try {
    const browsingObject = await Browsing.findOne({ user: req.user.id });
    const showData = await Browsing.findByIdAndUpdate(
      browsingObject._id,
      {
        $set: toBeUpdated,
      },
      { new: true }
    );
    res.json(showData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!!");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const browsingObject = await Browsing.findOne({ user: req.user.id });
    const dataToBeSent = await Browsing.findById(browsingObject._id);

    res.status(200).json(dataToBeSent);
  } catch (err) {}
});

module.exports = router;
