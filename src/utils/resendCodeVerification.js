const nodemailer = require("nodemailer");

const resendCodeVerification = async (name, email, verificationToken) => {
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
  <html lang="es">
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
          .hr {
            max-width: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div
        style="
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #ffffff;
          margin: 0 auto;
          max-width: 698px;
          padding: 20px;
        "
      >
        <div style="text-align: left">
          <img
            src="https://triploro.es/img/logo.png"
            alt="Logo"
            style="height: auto; width: 100%; max-width: 115px; max-height: 30px"
          />
        </div>
        <div style="max-width: 634px; text-align: center">
          <div>
            <h2
              style="
                color: #033156;
                text-align: center;
                font-weight: 600;
                font-size: 30px;
                margin: 16px auto;
              "
            >
              Verificación de Correo Electrónico
            </h2>
          </div>
          <p
            style="
              color: #333333;
              margin: 16px auto;
              text-align: center;
              font-size: 14px;
            "
          >
            Si deseas verificar tu correo electrónico, haz clic en el botón de abajo.
          </p>
          <div style="text-align: center">
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
              Verificar mi correo electrónico
            </a>
            <p style="margin: 16px auto; font-size: 14px">
              Si tienes problemas para hacer clic en el botón, puedes verificar tu
              correo electrónico con este enlace en su lugar: <br />
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
            <div
              style="
                max-width: 484px;
                margin: 0 auto;
                font-size: 14px;
                opacity: 65%;
                color: #333333;
              "
            >
              <p style="margin: 16px auto">
                Si no solicitaste una verificación de correo electrónico, puedes ignorar
                este correo electrónico de manera segura. Solo una persona con acceso a tu correo electrónico puede verificar la dirección de correo de tu cuenta.
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
                font-size: 14px;
              "
            >
              www.triploro.com
            </p>
            <p style="color: #999999; margin: 16px auto; font-size: 12px">
              Copyright © 2024
            </p>
          </div>
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
    subject: `¡Hola ${name}! Activa tu cuenta en Triploro`,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
  }
};

module.exports = resendCodeVerification;
