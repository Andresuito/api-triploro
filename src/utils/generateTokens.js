const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const expiresIn = 60 * 60 * 24 * 30;

  try {
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn,
    });

    return { token, expiresIn };
  } catch (error) {
    console.error(error);
    throw new Error("Error al generar el token");
  }
};

const generateTokenEmail = (email) => {
  const expiresIn = 30 * 60;
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET_EMAIL, {
      expiresIn,
    });

    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error al generar el token para el correo electrónico");
  }
};

const generateTokenPassword = (email) => {
  const expiresIn = 60 * 60;
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET_PASSWORD, {
      expiresIn,
    });

    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error al generar el token para el cambio de contraseña");
  }
};

module.exports = { generateToken, generateTokenEmail, generateTokenPassword };
