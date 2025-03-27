const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

/**
 * @route POST /sensors
 * @description Enregistre les données des capteurs de la serre
 * @body {float} Temperature - Température en °C
 * @body {float} Humidite - Humidité de l'air en %
 * @body {integer} Humidite_du_sol - 0=sec, 1=humide
 * @body {float} Luminosite - Niveau de lumière en lux
 * @body {integer} Lampe - État de la lampe (0/1)
 * @body {integer} Pompe - État de la pompe (0/1)
 * @body {integer} Temps_lumiere - Durée cumulée en secondes
 * @body {integer} Ventilateur - État du ventilateur (0/1)
 * @body {integer} Chauffage - État du chauffage (0/1)
 * @returns {object} Confirmation de l'enregistrement
 */
router.post('/', sensorController.saveSensorData);

/**
 * @route GET /sensors
 * @description Récupère les dernières données des capteurs
 * @returns {object} Données formatées pour le dashboard
 */
router.get('/', sensorController.getCurrentData);

module.exports = router;