const { writeSerreData, querySerreData } = require('../services/influxService');

class SerreData {
  /**
   * Sauvegarde les données de la serre dans InfluxDB
   * @param {Object} data - Données à sauvegarder (structure exacte de votre table Serre)
   */
  static async saveData(data) {
    const fields = {
      Chauffage: data.Chauffage,         // integer (0/1)
      Humidite: data.Humidite,           // float (%)
      Humidite_du_sol: data.Humidite_du_sol, // integer (0=sec, 1=humide)
      Lampe: data.Lampe,                 // integer (0/1)
      Luminosite: data.Luminosite,       // float (lux)
      Pompe: data.Pompe,                 // integer (0/1)
      Temps_lumiere: data.Temps_lumiere, // integer (secondes)
      Temperature: data.Temperature,     // float (°C)
      Ventilateur: data.Ventilateur      // integer (0/1)
    };
    
    await writeSerreData(fields);
  }

  /**
   * Récupère les dernières valeurs enregistrées
   * @returns {Promise<Array>} Dernières données de tous les capteurs/actionneurs
   */
  static async getLatest() {
    const fluxQuery = `
      from(bucket: "serre_db")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "Serre")
        |> last()
    `;
    return await querySerreData(fluxQuery);
  }

  /**
   * Récupère l'historique d'un champ spécifique
   * @param {string} field - Champ à récupérer (ex: "Temperature")
   * @param {string} period - Période (ex: "24h")
   */
  static async getHistoricalData(field, period = '24h') {
    const fluxQuery = `
      from(bucket: "serre_db")
        |> range(start: -${period})
        |> filter(fn: (r) => r._measurement == "Serre")
        |> filter(fn: (r) => r._field == "${field}")
        |> aggregateWindow(every: 10m, fn: mean) // Moyenne toutes les 10 minutes
    `;
    return await querySerreData(fluxQuery);
  }
}