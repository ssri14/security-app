const express = require("express");
const router = express.Router();
const DailyWorker = require("../models/DailyWorker");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const CounterdailyWorker = require("../models/CounterdailyWorker");
const { verifyEmail, sendEmail } = require("../functions/helperFunctions");

router.get("/fetchalldailyWorkers", fetchuser, async (req, res) => {
  try {
    const dailyWorkers = await DailyWorker.find({});
    res.json(dailyWorkers);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchdailyWorker/:id", fetchuser, async (req, res) => {
  try {
    const dailyWorker = await DailyWorker.findOne({ slNo: req.params.id });
    res.json(dailyWorker);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchdailyWorker/:searchBy/:value", fetchuser, async (req, res) => {
  try {
    const { searchBy, value } = req.params;
    let query;
    if (searchBy === "name") {
      // Case-insensitive regex match for name search
      query = { name: { $regex: new RegExp(value, "i") } };
    } else {
      // For other search criteria
      query = { [searchBy]: value };
    }
    const dailyWorkers = await DailyWorker.find(query);
    res.json(dailyWorkers);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/adddailyWorker",
  fetchuser,
  async (req, res) => {
    let success = false;
    const { name, email, address, mobileNumber, guardian, guardianName, place, natureOfWork, from, to, validupto, id } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    let em;
    if (verifyEmail(email)) {
      em = email;
    } else {
      em = "NA";
    }
    try {
      let dailyWorker;
      if (id === -1) {
        const cd = await CounterdailyWorker.findOneAndUpdate({ id: "autoval" }, { $inc: { seq: 1 } }, { new: true });
        let seqid;
        if (cd == null) {
          const newval = await CounterdailyWorker.create({ id: "autoval", seq: 1 });
          seqid = 1;
        } else {
          seqid = cd.seq;
        }
        dailyWorker = new DailyWorker({
          name,
          email: em,
          guardian,
          guardianName,
          address,
          mobileNumber,
          place,
          natureOfWork,
          duration: {
            from,
            to,
          },
          validupto: validupto,
          inTimeAddedBy: req.user.id,
          tin: Date(),
          slNo: seqid,
        });
        success = true;
        const savedDailyWorker = await dailyWorker.save();
        res.json({ success, entity: savedDailyWorker });
      } else {
        dailyWorker = await DailyWorker.findOneAndUpdate(
          { slNo: id },
          {
            $set: {
              tin: Date(),
              ouTimeAddedBy: "-1",
              tout: "-1",
              inTimeAddedBy: req.user.id,
            },
          },
          { new: true, upsert: true }
        );
        success = true;
        res.json({ success, entity: dailyWorker });
      }
      if (success && dailyWorker.email !== "NA") {
        const data = { user_type: "dailyWorkers", id: dailyWorker.slNo, name, mobileNumber };
        const result = await sendEmail(dailyWorker.email, data);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("errror occured");
    }
  }
);

router.patch("/updatedailyWorker/:id", fetchuser, async (req, res) => {
  try {
    let success = true;
    let dailyWorker = await DailyWorker.findOne({ slNo: req.params.id });
    if (!dailyWorker) {
      return res.json({ success: false, msg: "dailyWorker not found" });
    }
    if (dailyWorker.tout !== "-1") {
      return res.json({ success: false, msg: "dailyWorker already" });
    }
    dailyWorker = await DailyWorker.findOneAndUpdate(
      { slNo: req.params.id },
      { $set: { tout: Date(), ouTimeAddedBy: req.user.id } },
      { new: true }
    );
    let currentvisit = {
      pasttin: dailyWorker.tin,
      pasttout: dailyWorker.tout,
      pastinTimeAddedBy: dailyWorker.inTimeAddedBy,
      pastouTimeAddedBy: dailyWorker.ouTimeAddedBy,
    };
    let updateddailyWorker = await DailyWorker.findOneAndUpdate(
      { slNo: req.params.id },
      { $push: { pastvisit: currentvisit } },
      { new: true }
    );
    res.json({ success, updateddailyWorker });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("errror occured");
  }
});

router.patch("/updatevaliditydailyWorker/:id", fetchuser, async (req, res) => {
  const { validupto } = req.body;
  try {
    let success = true;
    let dailyWorker = await DailyWorker.findOne({ slNo: req.params.id });
    if (!dailyWorker) {
      return res.json({ success: false, msg: "dailyWorker not found" });
    }
    dailyWorker = await DailyWorker.findOneAndUpdate(
      { slNo: req.params.id },
      { $set: { validupto: validupto } },
      { new: true }
    );
    res.json({ success, dailyWorker });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("errror occured");
  }
});

module.exports = router;
