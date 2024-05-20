const User = require("../src/models/User");
const bcrypt = require("bcrypt");

const names = [
  "Juan",
  "Ana",
  "Carlos",
  "Maria",
  "Jose",
  "Carmen",
  "Francisco",
  "Isabel",
  "Antonio",
  "Pilar",
];
const surnames = [
  "Garcia",
  "Gonzalez",
  "Rodriguez",
  "Fernandez",
  "Lopez",
  "Martinez",
  "Sanchez",
  "Perez",
  "Gomez",
  "Martin",
];
const boolValues = [true, false];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

async function addFakeUsers(numUsers = 10) {
  for (let i = 0; i < numUsers; i++) {
    const name = getRandomElement(names);
    const surname = getRandomElement(surnames);
    const password = await bcrypt.hash(getRandomPassword(), 10);
    const fakeUser = {
      email: `${name}.${surname}@triploro.com`,
      username: `${name}${surname}`,
      password: password,
      name: name,
      surname: surname,
      receiveNewsletter: getRandomElement(boolValues),
      receiveNewDestination: getRandomElement(boolValues),
      isActivated: 1,
    };

    try {
      let user = await User.findOne({ username: fakeUser.username });
      if (!user) {
        user = await User.create(fakeUser);
      }
    } catch (err) {
      console.error(`Error creating user ${fakeUser.username}: ${err.message}`);
    }
  }
}

module.exports = addFakeUsers;
