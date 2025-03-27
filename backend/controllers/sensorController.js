const SerreData = require('../models/SerreData');

// Définition de l'objet controller
const sensorController = {
  /**
   * Enregistre les données des capteurs
   * Correspond aux endpoints REST pour votre application
   */
  saveSensorData: async (req, res) => {
    try {
      // Validation basique des données reçues
      if (!req.body.Temperature || !req.body.Humidite) {
        return res.status(400).json({ error: 'Données capteurs manquantes' });
      }

      // Structure exacte comme dans votre base InfluxDB
      const sensorData = {
        Chauffage: req.body.Chauffage || 0,
        Humidite: parseFloat(req.body.Humidite),
        Humidite_du_sol: req.body.Humidite_du_sol || 0,
        Lampe: req.body.Lampe || 0,
        Luminosite: parseFloat(req.body.Luminosite),
        Pompe: req.body.Pompe || 0,
        Temps_lumiere: req.body.Temps_lumiere || 0,
        Temperature: parseFloat(req.body.Temperature),
        Ventilateur: req.body.Ventilateur || 0
      };

      await SerreData.saveData(sensorData);
      res.status(201).json({ message: 'Données enregistrées' });
    } catch (error) {
      console.error('Erreur sauvegarde données:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * Récupère les dernières données pour le dashboard
   */
  getCurrentData: async (req, res) => {
    try {
      const data = await SerreData.getLatest();
      
      // Formatage pour le frontend
      // Format original (data) :
   /* [
    { _field: 'Temperature', _value: 24.5 },
    { _field: 'Humidite', _value: 65 },
    { _field: 'Lampe', _value: 1 },
    ...
  ]*/
      const formattedData = {};
      data.forEach(item => {
        formattedData[item._field] = item._value;
      });
      /*
            // Format transformé (formattedData) :
        {
        Temperature: 24.5,
        Humidite: 65,
        Lampe: 1,
        ...
        }
        console.log(formattedData.Temperature); // 24.5
      */
      res.json(formattedData);
    } catch (error) {
      console.error('Erreur récupération données:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

// Export avec module.exports
module.exports = sensorController;