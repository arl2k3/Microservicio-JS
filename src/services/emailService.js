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

const sendRecoveryEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Recovery",
      html: `<p>Use this email to recover your account. If you didn't request this, please ignore it.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendRecoveryEmail };
