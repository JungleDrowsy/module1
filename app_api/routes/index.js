const express = require('express'); // Express app
const router = express.Router(); // Express router

// Import controller
const tripsController = require('../controllers/trips');

// Define routes
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(tripsController.tripsAddTrip); // POST Method Adds a Trip

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET Method routes tripsFindByCode
    .put(tripsController.tripsUpdateTrip);

module.exports = router;