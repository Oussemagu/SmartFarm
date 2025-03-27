const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const config = require('../config/influxdb');

// Initialisation du client InfluxDB avec la configuration
const influxDB = new InfluxDB({ 
  url: config.url, 
  token: config.token 
});

// Création des APIs pour écrire et interroger les données
const writeApi = influxDB.getWriteApi(config.org, config.bucket);
const queryApi = influxDB.getQueryApi(config.org);

/**
 * Écrit les données de la serre dans InfluxDB
 * @param {Object} fields - Les champs de données (Température, Humidité, etc.)
 * @param {Object} tags - Métadonnées optionnelles (ex: emplacement du capteur)
 */
async function writeSerreData(fields, tags = {}) {
  const point = new Point(config.measurement);
  //Point est une classe du client InfluxDB qui représente une unité de données à écrire dans la base de données. 
  // Chaque Point correspond à une entrée dans votre measurement "Serre".
  // Ajout des tags (métadonnées)
  // Un Point par ensemble de mesures simultanées
  for (const [key, value] of Object.entries(tags)) {
    point.tag(key, value);
    // ajoute un tag (étiquette) à votre point de données.
    //but :Indexer les données pour des recherches rapides
  }
  
  // Ajout des champs avec leur type correct (integer/float)
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        point.intField(key, value); // Pour les entiers (Lampe, Pompe, etc.)
      } else {
        point.floatField(key, value); // Pour les floats (Température, Humidité)
      }
    }
  }
  
  writeApi.writePoint(point);
  await writeApi.flush(); // Envoi des données
}

/**
 * Exécute une requête Flux sur InfluxDB
 * @param {string} fluxQuery - Requête en langage Flux
 * @returns {Promise<Array>} Résultats de la requête
 */
async function querySerreData(fluxQuery) {
  const result = [];
  
  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        result.push(tableMeta.toObject(row)); // Conversion des résultats en objets JS
      //  tableMeta.toObject(row) convertit la ligne Flux en objet JS
      //L'objet est poussé dans l'array result


      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      }
    });
  });
}

module.exports = {
  writeSerreData,
  querySerreData
};
/*Requête pour obtenir la température des dernières 24h
const query = `
  from(bucket: "serre_db")
    |> range(start: -24h)
    |> filter(fn: (r) => r._measurement == "Serre")
    |> filter(fn: (r) => r._field == "Temperature")
`;

const results = await querySerreData(query);
// results contient maintenant un array d'objets température*/