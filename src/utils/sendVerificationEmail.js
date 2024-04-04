const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const verificationUrl = `${
    process.env.NODE_ENV === "development"
      ? process.env.CORS_ORIGIN
      : process.env.CORS_ORIGIN_PROD
  }/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "¡Bienvenido a TripLoro! Por favor, verifica tu cuenta",
    html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center;">
          <img src="https://yourwebsite.com/logo.png" alt="Logo" style="height: 50px;"/>
        </div>
        <h2 style="color: #333; text-align: center;">¡Bienvenido a TripLoro!</h2>
        <p style="color: #555; text-align: center;">Estamos emocionados de tenerte con nosotros. Por favor, verifica tu cuenta haciendo clic en el botón de abajo.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verificar mi cuenta</a>
        </div>
        <p style="color: #555; text-align: center;">¡Gracias y bienvenido!</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="color: #777; font-size: 0.8em; text-align: center;">Si tienes problemas para hacer clic en el botón "Verificar mi cuenta", copia y pega la URL a continuación en tu navegador web: ${verificationUrl}</p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
  }
};

module.exports = sendVerificationEmail;
