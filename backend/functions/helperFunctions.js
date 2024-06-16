const qr = require("qrcode");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const emailWhitelist = ["gmail.com", "yahoo.com", "outlook.com", "iitism.ac.in"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const verifyEmail = (email) => {
  // Extract domain from the email address
  const domain = email.split("@")[1];
  // Check if the domain is on the whitelist
  if (emailWhitelist.includes(domain)) {
    return true;
  } else {
    return false;
  }
};

async function generateQRCode(data) {
  try {
    // Generate QR code as a data URI
    const jsonString = JSON.stringify(data);
    const qrDataURI = await qr.toDataURL(jsonString);

    // Write the QR code image to a file
    fs.writeFileSync("qrcode.png", qrDataURI.split(",")[1], "base64");
    return qrDataURI;
  } catch (err) {
    console.error("Error generating QR code:", err);
  }
}

const sendEmail = async (email, data) => {
  if (!verifyEmail(email)) {
    return false;
  }
  // Generate QR code data URI with provided data
  const qrDataURI = await generateQRCode(data);
  const htmlContent = `
  <p>Hello ${data.name},</p>
    <p>Your security details are as follows:</p>
    <ul>
        <li>User ID: ${data.id}</li>
        <li>Name: ${data.name}</li>
        <li>Mobile Number: ${data.mobileNumber}</li>
    </ul>
  <img src="cid:qrcode" alt="QR Code">
  <p>This is a system-generated email. Please do not reply to this email.</p>
  <p>Thanks</p>
    `;

  //Email content
  const mailOptions = {
    from: {
      name: "ISM-Security",
      address: process.env.USER_EMAIL,
    },
    to: email,
    subject: "Important: Your Security Profile Details",
    html: htmlContent,
    attachments: [
      {
        // encoded string as an attachment
        filename: "qrcode.png",
        content: qrDataURI.split("base64,")[1],
        encoding: "base64",
        cid: "qrcode",
      },
    ],
  };

  try {
    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw new Error("Error sending email.", error);
  }
};

module.exports = { verifyEmail, generateQRCode, sendEmail };
