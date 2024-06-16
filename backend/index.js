const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { generateQRCode, sendEmail } = require("./functions/helperFunctions");
require("dotenv").config();
connectToMongo();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

//testing routes
app.get("/send-mail", async (req, res) => {
  try {
    const data = { user_type: "visitor", id: 4, name: "new demo name", mobileNumber: 9123467890 };
    const result = await sendEmail("kumarnimit0316@gmail.com", data);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message, msg: "Something went wrong." });
  }
});

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/visitors", require("./routes/visitor"));
app.use("/api/contractors", require("./routes/contractor"));
app.use("/api/dailyWorkers", require("./routes/dailyWorker"));
app.use("/api/collegeMaterials", require("./routes/collegeMaterial"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`security-backend app listening on port ${port}`);
});
