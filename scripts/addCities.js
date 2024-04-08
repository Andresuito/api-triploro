const Destination = require("../src/models/Destinations");
const Country = require("../src/models/Country");

async function addCities() {
  try {
    const spain = await Country.findOne({ where: { name: "Spain" } });
    const portugal = await Country.findOne({ where: { name: "Portugal" } });

    await Destination.findOrCreate({
      where: { name: "madrid" },
      defaults: {
        description: "Capital de España",
        imageUrl: "URL_de_la_imagen_de_Madrid",
        latitude: 40.4168,
        longitude: -3.7038,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "barcelona" },
      defaults: {
        description: "Ciudad cosmopolita y cultural",
        imageUrl: "URL_de_la_imagen_de_Barcelona",
        latitude: 41.3851,
        longitude: 2.1734,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "valencia" },
      defaults: {
        description: "Famosa por la Ciudad de las Artes y las Ciencias",
        imageUrl: "URL_de_la_imagen_de_Valencia",
        latitude: 39.4699,
        longitude: -0.3763,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "sevilla" },
      defaults: {
        description: "Conocida por su arquitectura y flamenco",
        imageUrl: "URL_de_la_imagen_de_Sevilla",
        latitude: 37.3886,
        longitude: -5.9823,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "malaga" },
      defaults: {
        description: "Ciudad costera en la Costa del Sol",
        imageUrl: "URL_de_la_imagen_de_Málaga",
        latitude: 36.7213,
        longitude: -4.4215,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "bilbao" },
      defaults: {
        description: "Conocida por el Museo Guggenheim",
        imageUrl: "URL_de_la_imagen_de_Bilbao",
        latitude: 43.263,
        longitude: -2.935,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "granada" },
      defaults: {
        description: "Famosa por la Alhambra",
        imageUrl: "URL_de_la_imagen_de_Granada",
        latitude: 37.1773,
        longitude: -3.5986,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "zaragoza" },
      defaults: {
        description: "Ciudad histórica a orillas del río Ebro",
        imageUrl: "URL_de_la_imagen_de_Zaragoza",
        latitude: 41.6488,
        longitude: -0.8891,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "palma de mallorca" },
      defaults: {
        description: "Capital de las Islas Baleares",
        imageUrl: "URL_de_la_imagen_de_Palma_de_Mallorca",
        latitude: 39.5696,
        longitude: 2.6502,
        countryId: spain.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "lisboa" },
      defaults: {
        description: "Capital de Portugal",
        imageUrl: "URL_de_la_imagen_de_Lisboa",
        latitude: 38.7223,
        longitude: -9.1393,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "oporto" },
      defaults: {
        description: "Famosa por el vino de Oporto",
        imageUrl: "URL_de_la_imagen_de_Oporto",
        latitude: 41.1579,
        longitude: -8.6291,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "faro" },
      defaults: {
        description: "Destino turístico en el Algarve",
        imageUrl: "URL_de_la_imagen_de_Faro",
        latitude: 37.0194,
        longitude: -7.9305,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "coimbra" },
      defaults: {
        description: "Famosa por su universidad medieval",
        imageUrl: "URL_de_la_imagen_de_Coímbra",
        latitude: 40.2033,
        longitude: -8.4103,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "braga" },
      defaults: {
        description: "Ciudad religiosa con una rica historia",
        imageUrl: "URL_de_la_imagen_de_Braga",
        latitude: 41.551,
        longitude: -8.426,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "aveiro" },
      defaults: {
        description: "Conocida como la Venecia de Portugal",
        imageUrl: "URL_de_la_imagen_de_Aveiro",
        latitude: 40.6443,
        longitude: -8.6455,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "evora" },
      defaults: {
        description: "Ciudad con un impresionante centro histórico",
        imageUrl: "URL_de_la_imagen_de_Évora",
        latitude: 38.5714,
        longitude: -7.9097,
        countryId: portugal.id,
      },
    });

    await Destination.findOrCreate({
      where: { name: "guimarães" },
      defaults: {
        description: "Cuna de la nación portuguesa",
        imageUrl: "URL_de_la_imagen_de_Guimarães",
        latitude: 41.4417,
        longitude: -8.2968,
        countryId: portugal.id,
      },
    });
  } catch (err) {
    console.error("Error insertando datos:", err);
  }
}

module.exports = addCities;
