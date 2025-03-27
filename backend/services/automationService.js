const cron = require('node-cron');
const SerreData = require('../models/SerreData');

// Seuils définis dans le rapport PFE
const THRESHOLDS = {
  TEMP_MAX: 25,       // Seuil pour activer le ventilateur
  TEMP_MIN: 12,       // Seuil pour activer le chauffage
  LUMINOSITE_MIN: 800, // Seuil pour activer la lampe
  HUMIDITE_SOL_MIN: 0.3 // Seuil humidité du sol
};

/**
 * Implémente la logique d'automatisation de votre serre
 * Basée sur les règles décrites dans le PFE
 */
function startAutomation() {
  // Planifie une tâche toutes les 10 secondes (comme dans le PFE)
  cron.schedule('*/10 * * * * *', async () => {
    try {
      const data = await SerreData.getLatest();
      
      // Convertit les données Flux en objet simple
      const currentData = {};
      data.forEach(item => {
        currentData[item._field] = item._value;
      });
      
      // 1. Gestion de la température (Ventilateur/Chauffage)
      if (currentData.Temperature > THRESHOLDS.TEMP_MAX) {
        await SerreData.saveData({ Ventilateur: 1 }); // Active le ventilateur
      } else if (currentData.Temperature < THRESHOLDS.TEMP_MIN) {
        await SerreData.saveData({ Chauffage: 1 }); // Active le chauffage
      } else {
        // Désactive les deux si dans la plage normale
        await SerreData.saveData({ Ventilateur: 0, Chauffage: 0 });
      }
      
      // 2. Gestion de la lumière (Lampe)
      const now = new Date();
      const hours = now.getHours();
      // Entre 7h et 19h comme spécifié dans votre PFE
      if (hours >= 7 && hours < 19) {
        if (currentData.Luminosite < THRESHOLDS.LUMINOSITE_MIN) {
          await SerreData.saveData({ Lampe: 1 }); // Allume la lampe
        } else {
          await SerreData.saveData({ Lampe: 0 }); // Éteint si luminosité suffisante
        }
      } else {
        await SerreData.saveData({ Lampe: 0 }); // Éteint la nuit
      }
      
      // 3. Gestion de l'arrosage (Pompe)
      if (currentData.Humidite_du_sol === 0) { // 0 = sol sec
        await SerreData.saveData({ Pompe: 1 }); // Active la pompe
      } else {
        await SerreData.saveData({ Pompe: 0 }); // Arrête la pompe
      }
      
      // 4. Mise à jour du temps d'éclairage cumulé
      if (currentData.Lampe === 1) {
        // Ajoute 10 secondes (intervalle d'exécution)
        const newTime = (currentData.Temps_lumiere || 0) + 10;
        await SerreData.saveData({ Temps_lumiere: newTime });
      }
      
    } catch (error) {
      console.error('Erreur automation:', error);
    }
  });
}

module.exports = { startAutomation };