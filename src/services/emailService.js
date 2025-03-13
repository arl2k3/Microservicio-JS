const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ?? Desactiva la validación de certificados
  },
});

const sendRecoveryEmail = async (email, content) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Recovery",
      html: content,
    });
  } catch (error) {
    throw new Error("Error sending email");
  }
};

module.exports = { sendRecoveryEmail };
