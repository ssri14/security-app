const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Counter = require("../models/Counter");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const { backup, restore } = require("../functions/backupRestore");
const Admin = require("../models/Admin");
const Url = require("../models/Url");
const JWT_SECRET = process.env.JWT_SECRET;

//Router 1:create a user using: POST "/api/auth/createuser" Doesn't require login
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter password of min 5 length").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if error return bad request
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      const cd = await Counter.findOneAndUpdate({ id: "autoval" }, { $inc: { seq: 1 } }, { new: true });
      let seqid;
      if (cd == null) {
        const newval = await Counter.create({ id: "autoval", seq: 1 });
        seqid = 1;
      } else {
        seqid = cd.seq;
      }
      // check if user with same email exits already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "sorry a user already exits with same email" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        id: seqid,
      });
      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      // catch error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Router 2:login using: POST "/api/auth/login" Doesn't require login
router.post(
  "/login",
  [body("email", "Enter a valid email").isEmail(), body("password", "Password cannot be blanked").exists()],
  async (req, res) => {
    // if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let success = false;
    const { email, password } = req.body;
    try {
      // check if user with same email exits already
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }

      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      const id = user.id;
      res.json({ success, authtoken, msg: "logged in successfully", id });
    } catch (error) {
      // catch error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Router 3:get logged user details using: POST "/api/auth/getuser" require login
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


router.post("/backup", fetchuser, async (req, res) => {
  try {
    await backup();
    res.json({ success: true });
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post("/restore", fetchuser, async (req, res) => {
  try {
    await restore();
    res.json({ success: true });
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});


//admin signup
router.post(
  "/createuser2",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter password of min 5 length").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if error return bad request
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ email: req.body.email });
      if (admin) {
        return res.status(400).json({ success, error: "sorry an admin already exits with same email" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      admin = await Admin.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          name: admin.name,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success });
    } catch (error) {
      // catch error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// admin login
router.post(
  "/login2",
  [body("email", "Enter a valid email").isEmail(), body("password", "Password cannot be blanked").exists()],
  async (req, res) => {
    // if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let success = false;
    const { email, password } = req.body;
    try {
      // check if user with same email exits already
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }
      const passwordComp = await bcrypt.compare(password, admin.password);
      if (!passwordComp) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }
      const data = {
        user: {
          name: admin.name,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken, msg: "logged in successfully" });
    } catch (error) {
      // catch error
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//fetch url
router.get("/fetchurl", async (req, res) => {
  try {
    const url = await Url.findOne({ id: 1 });
    res.json(url);
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//edit url
router.post(
  "/editurl",
  fetchuser,
  async (req, res) => {
    let success = false;
    console.log(req.body)
    const { urlText } = req.body;
    try {
      const count = await Url.count();
      let url;
      if (count == 0) {
        url = await Url.create({
          urlText
        });
      } else {
        const url = await Url.findOneAndUpdate({ id: 1 }, {
          $set: {
            urlText: urlText
          },
        }, { new: true, upsert: true });
      }
      // console.log(savedContractor);
      success = true;
      res.json({ success, entity: url });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("errror occured");
    }
  }
);


module.exports = router;
