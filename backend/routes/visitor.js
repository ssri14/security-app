const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Countervisitor = require("../models/Countervisitor");
const { verifyEmail, sendEmail } = require("../functions/helperFunctions");

router.get("/fetchallvisitors", fetchuser, async (req, res) => {
  try {
    const visitors = await Visitor.find({});
    res.json(visitors);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchvisitor/:id", fetchuser, async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ slNo: req.params.id });
    res.json(visitor);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchvisitor/:searchBy/:value", fetchuser, async (req, res) => {
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
    const visitors = await Visitor.find(query);
    res.json(visitors);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/addvisitor",
  fetchuser,
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("address", "Enter valid address").isLength({ min: 5 }),
    body("mobileNumber", "Enter valid mobileNumber").isLength(10),
    body("purpose", "Enter valid purpose").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const { name, email, address, mobileNumber, purpose, vehicleNumber, vehicleType, id } = req.body;
    const errors = validationResult(req);
    let vn, vt, em;
    if (verifyEmail(email)) {
      em = email;
    } else {
      em = "NA";
    }
    if (vehicleNumber) {
      vn = vehicleNumber;
      vt = vehicleType;
    } else {
      vn = "NA";
      vt = "NA";
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let visitor;
      if (id === -1) {
        const cd = await Countervisitor.findOneAndUpdate({ id: "autoval" }, { $inc: { seq: 1 } }, { new: true });
        let seqid;
        if (cd == null) {
          const newval = await Countervisitor.create({ id: "autoval", seq: 1 });
          seqid = 1;
        } else {
          seqid = cd.seq;
        }
        visitor = new Visitor({
          name,
          email: em,
          address,
          mobileNumber,
          purpose,
          vn,
          vt,
          inTimeAddedBy: req.user.id,
          tin: Date(),
          slNo: seqid,
        });
        success = true;
        const savedVisitor = await visitor.save();
        res.json({ success, entity: savedVisitor });
      } else {
        visitor = await Visitor.findOneAndUpdate(
          { slNo: id },
          {
            $set: {
              tin: Date(),
              ouTimeAddedBy: "-1",
              tout: "-1",
              inTimeAddedBy: req.user.id,
              purpose: purpose,
              vn: vn,
              vt: vt,
            },
          },
          { new: true, upsert: true }
        );
        success = true;
        res.json({ success, entity: visitor });
      }
      if (success && visitor.email !== "NA") {
        const data = { user_type: "visitors", id: visitor.slNo, name, mobileNumber };
        const result = await sendEmail(visitor.email, data);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("errror occured");
    }
  }
);

router.patch("/updatevisitor/:id", fetchuser, async (req, res) => {
  try {
    let success = true;
    let visitor = await Visitor.findOne({ slNo: req.params.id });
    if (!visitor) {
      // return res.status(404).send("not found");
      return res.json({ success: false, msg: "visitor not found" });
    }
    if (visitor.tout !== "-1") {
      return res.json({ success: false, msg: "visitor already" });
    }
    visitor = await Visitor.findOneAndUpdate(
      { slNo: req.params.id },
      { $set: { tout: Date(), ouTimeAddedBy: req.user.id } },
      { new: true }
    );
    let currentvisit = {
      pasttin: visitor.tin,
      pasttout: visitor.tout,
      pastvn: visitor.vn,
      pastvt: visitor.vt,
      pastpurpose: visitor.purpose,
      pastinTimeAddedBy: visitor.inTimeAddedBy,
      pastouTimeAddedBy: visitor.ouTimeAddedBy,
    };
    let updatedvisitor = await Visitor.findOneAndUpdate(
      { slNo: req.params.id },
      { $push: { pastvisit: currentvisit } },
      { new: true }
    );
    res.json({ success, updatedvisitor });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("errror occured");
  }
});

module.exports = router;
