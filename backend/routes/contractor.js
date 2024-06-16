const express = require("express");
const router = express.Router();
const Contractor = require("../models/Contractor");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Countercontractor = require("../models/Countercontractor");

router.get("/fetchallcontractors", fetchuser, async (req, res) => {
  try {
    const contractors = await Contractor.find({});
    res.json(contractors);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchcontractor/:id", fetchuser, async (req, res) => {
  try {
    const contractor = await Contractor.findOne({ slNo: req.params.id });
    res.json(contractor);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/fetchcontractor/:searchBy/:value", fetchuser, async (req, res) => {
  try {
    const { searchBy, value } = req.params;
    let query;
    if (searchBy === "name" || searchBy === "driverName") {
      // Case-insensitive regex match for name search
      query = { [searchBy]: { $regex: new RegExp(value, "i") } };
    } else if (searchBy === "mobileNumber&dlNo") {
      const mobileNumber = value.substring(0, 10);
      const dlNo = value.substring(10);
      query = { mobileNumber: mobileNumber, dlNo: dlNo };
    } else {
      // For other search criteria
      query = { [searchBy]: value };
    }
    const contractors = await Contractor.find(query);
    res.json(contractors);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/addcontractor",
  fetchuser,
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("driverName", "Enter valid driver name").isLength({ min: 3 }),
    body("mobileNumber", "Enter valid mobileNumber").isLength(10),
  ],
  async (req, res) => {
    let success = false;
    const { name, mobileNumber, driverName, dlNumber, challanNumber, vehicleNumber, amount, product, from, id } =
      req.body;
    let cn;
    if (challanNumber) {
      cn = challanNumber;
    } else {
      cn = "NA";
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      if (id === -1) {
        const cd = await Countercontractor.findOneAndUpdate({ id: "autoval" }, { $inc: { seq: 1 } }, { new: true });
        let seqid;
        if (cd == null) {
          const newval = await Countercontractor.create({ id: "autoval", seq: 1 });
          seqid = 1;
        } else {
          seqid = cd.seq;
        }
        const contractor = new Contractor({
          name,
          driverName,
          mobileNumber,
          dlNo: dlNumber,
          cn,
          amount,
          product,
          from,
          vn: vehicleNumber,
          inTimeAddedBy: req.user.id,
          tin: Date(),
          slNo: seqid,
        });
        success = true;
        const savedContractor = await contractor.save();
        res.json({ success, entity: savedContractor });
      } else {
        let updatecontractor = await Contractor.findOneAndUpdate(
          { slNo: id },
          {
            $set: {
              tin: Date(),
              ouTimeAddedBy: "-1",
              tout: "-1",
              inTimeAddedBy: req.user.id,
              vn: vehicleNumber,
              cn: cn,
              amount: amount,
              product: product,
              from: from,
            },
          },
          { new: true, upsert: true }
        );
        console.log(updatecontractor);
        success = true;
        res.json({ success, entity: updatecontractor });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("errror occured");
    }
  }
);

router.patch("/updatecontractor/:id", fetchuser, async (req, res) => {
  try {
    let success = true;
    let contractor = await Contractor.findOne({ slNo: req.params.id });
    if (!contractor) {
      return res.json({ success: false, msg: "contractor not found" });
    }
    if (contractor.tout !== "-1") {
      return res.json({ success: false, msg: "contractor already exited" });
    }
    contractor = await Contractor.findOneAndUpdate(
      { slNo: req.params.id },
      { $set: { tout: Date(), ouTimeAddedBy: req.user.id } },
      { new: true }
    );
    let currentvisit = {
      pasttin: contractor.tin,
      pasttout: contractor.tout,
      pastvn: contractor.vn,
      pastcn: contractor.cn,
      pastproduct: contractor.product,
      pastfrom: contractor.from,
      pastamount: contractor.amount,
      pastinTimeAddedBy: contractor.inTimeAddedBy,
      pastouTimeAddedBy: contractor.ouTimeAddedBy,
    };
    let updatedcontractor = await Contractor.findOneAndUpdate(
      { slNo: req.params.id },
      { $push: { pastvisit: currentvisit } },
      { new: true }
    );
    res.json({ success, updatedcontractor });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("errror occured");
  }
});

module.exports = router;
