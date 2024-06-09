const nodemailer = require("nodemailer");

const sendVerificationEmail = async (name, email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
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

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        rel="stylesheet"
      />
      <title></title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            padding: 14px !important;
          }
          .hr {
            max-width: 100% !important;
          }
          .title {
            font-size: 24px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0">
      <div
        style="
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #ffffff;
          margin: 0 auto;
          max-width: 698px;
          padding: 20px;
          text-align: center;
          display: block;
        "
      >
        <div style="text-align: left">
          <img
            src="https://triploro.es/img/logo.png"
            alt="Logo"
            style="height: auto; width: 100%; max-width: 115px; max-height: 30px"
          />
        </div>
        <div style="padding: 20px">
          <h2
            style="
              color: #033156;
              text-align: center;
              font-weight: 600;
              font-size: 30px;
              margin: 16px auto;
            "
          >
            Hola ${name},
          </h2>
        </div>
        <div style="text-align: center">
          <img
            src="https://www.triploro.es/img/new_user.png"
            alt="Bienvenido"
            style="margin: auto; width: 100%; text-align: center"
          />
        </div>
        <div class="container" style="padding: 32px; text-align: center">
          <h1
            class="title"
            style="
              font-size: 30px;
              color: #033156;
              margin: 16px auto;
              font-weight: 600;
            "
          >
            Verifica tu correo electrónico para comenzar
          </h1>
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              background-color: #033156;
              border-radius: 12px;
              padding: 10px 40px;
              color: #ffffff;
              font-size: 16px;
              font-weight: 600;
              margin: 16px auto;
              line-height: 24px;
              cursor: pointer;
              border: none;
              text-decoration: none;
            "
          >
            Comenzar
          </a>
          <p style="margin: 16px auto; font-size: 14px">
            Si tienes problemas para hacer clic en el botón, verifica tu correo electrónico con
            este enlace en su lugar:
            <span style="color: #333333; opacity: 50%">${verificationUrl}</span>
          </p>
          <hr
            class="hr"
            style="
              max-width: 420px;
              opacity: 20%;
              color: #033156;
              margin: 16px auto;
            "
          />
          <h1
            style="
              font-size: 20px;
              color: #000000;
              opacity: 50%;
              margin: 16px auto;
            "
          >
            Planea tu próximo viaje y compártelo con el mundo.
          </h1>
          <div
            style="
              max-width: 397px;
              margin: 0 auto;
              font-size: 14px;
              opacity: 65%;
              color: #333333;
            "
          >
            <p style="margin: 16px auto">
              Descubre nuestra selección curada de itinerarios para tus próximos
              viajes, o crea el tuyo propio para compartir con la comunidad.
            </p>
            <p style="margin: 16px auto">
              ¿Encontraste un itinerario casi perfecto que necesita un toque personal? Adopta
              itinerarios compartidos por la comunidad a través de Triploro y personalízalos a
              tus preferencias.
            </p>
            <p style="margin: 16px auto">
              Con Triploro, puedes hacer que cada viaje sea único y
              compartirlo con el mundo.
            </p>
          </div>
          <hr
            class="hr"
            style="
              max-width: 420px;
              opacity: 20%;
              color: #033156;
              margin: 16px auto;
            "
          />
          <p
            style="
              color: #333333;
              opacity: 50%;
              margin: 16px auto;
              font-size: 12px;
            "
          >
            www.triploro.com
          </p>
          <p style="color: #999999; margin: 16px auto; font-size: 12px">
            Copyright © 2024
          </p>
        </div>
      </div>
    </body>
  </html>   
  `;

  const mailOptions = {
    from: {
      name: "Triploro",
      address: process.env.MAIL_USERNAME,
    },
    to: email,
    subject: `¡Bienvenido a Triploro ${name} ! Por favor, verifica tu cuenta`,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
  }
};

module.exports = sendVerificationEmail;
