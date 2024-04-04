const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, passwordToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const passwordUrl = `${
    process.env.NODE_ENV === "development"
      ? process.env.CORS_ORIGIN
      : process.env.CORS_ORIGIN_PROD
  }/reset-password?token=${passwordToken}`;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Restablecer contraseña olvidada - Triploro",
    html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center;">
          <img src="https://yourwebsite.com/logo.png" alt="Logo" style="height: 50px;"/>
        </div>
        <h2 style="color: #333; text-align: center;">Restablecer contraseña</h2>
        <p style="color: #555; text-align: center;">Haz clic en el botón de abajo para restablecer tu contraseña.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${passwordUrl}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Restablecer contraseña</a>
        </div>
        <p style="color: #555; text-align: center;">¡Gracias!</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="color: #777; font-size: 0.8em; text-align: center;">Si tienes problemas para hacer clic en el botón "Restablecer contraseña", copia y pega la URL a continuación en tu navegador web: ${passwordUrl}</p>
        <div style="background-color: orange; color: black; font-size: 0.8em; text-align: center; margin-top: 20px; padding: 5px; border-radius: 5px;">
        <p>Si no has solicitado un restablecimiento de contraseña, puedes ignorar este correo electrónico o eliminarlo.</p>
        </div>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(
      "Error al enviar el correo de restablecimiento de contraseña:",
      error
    );
  }
};

module.exports = sendPasswordResetEmail;
