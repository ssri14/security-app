const express = require("express");
const router = express.Router();
const CollegeMaterial = require("../models/CollegeMaterial");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const CountercollegeMaterial = require("../models/CountercollegeMaterial");

router.get("/fetchallcollegeMaterials", fetchuser, async (req, res) => {
  try {
    const collegeMaterials = await CollegeMaterial.find({});
    res.json(collegeMaterials);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchcollegeMaterial/:id", fetchuser, async (req, res) => {
  try {
    const collegeMaterial = await CollegeMaterial.findOne({ slNo: req.params.id });
    res.json(collegeMaterial);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchcollegeMaterial/:searchBy/:value", fetchuser, async (req, res) => {
  try {
    const { searchBy, value } = req.params;
    let query;
    if (searchBy === "particularOfPerson") {
      // Case-insensitive regex match for name search
      query = { particularOfPerson: { $regex: new RegExp(value, "i") } };
    } else {
      // For other search criteria
      query = { [searchBy]: value };
    }
    const collegeMaterials = await CollegeMaterial.find(query);
    res.json(collegeMaterials);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/addcollegeMaterial",
  fetchuser,
  async (req, res) => {
    let success = false;
    const { particularOfPerson, mobileNumber, materials, from, to, incomingOrOutgoing } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      const cd = await CountercollegeMaterial.findOneAndUpdate({ id: "autoval" }, { $inc: { seq: 1 } }, { new: true });
      let seqid;
      if (cd == null) {
        const newval = await CountercollegeMaterial.create({ id: "autoval", seq: 1 });
        seqid = 1;
      } else {
        seqid = cd.seq;
      }
      console.log(seqid);
      const collegeMaterial = new CollegeMaterial({
        particularOfPerson,
        mobileNumber,
        materials,
        from,
        to,
        incomingOrOutgoing,
        ouTimeAddedBy: req.user.id,
        tout: Date(),
        slNo: seqid,
      });

      console.log(collegeMaterial);
      success = true;
      const savedCollegeMaterial = await collegeMaterial.save();
      res.json({ success, entity: savedCollegeMaterial });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("errror occured");
    }
  }
);

module.exports = router;
