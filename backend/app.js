const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//logger http qui enregistre automatiquement les requetes http entrantes et sortantes , les ionformations sur
//chaque requete http

const sensorRoutes = require('./routes/sensors');
const actuatorRoutes = require('./routes/actuators');
const { startAutomation } = require('./services/automationService');

// Initialisation de l'application Express
const app = express();

// Middlewares
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse le JSON des requêtes
app.use(morgan('dev')); // Log des requêtes HTTP
//format 'dev' predefini qui affiche les logs http sous format:
//:method :url :status :response-time ms - :res[content-length]


// Routes
app.use('/api/sensors', sensorRoutes); // Endpoints pour les capteurs
app.use('/api/actuators', actuatorRoutes); // Endpoints pour les actionneurs

// Démarre le système d'automatisation
startAutomation();

// Port d'écoute (peut être configuré via variable d'environnement)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur de la serre intelligente démarré sur le port ${PORT}`);
});