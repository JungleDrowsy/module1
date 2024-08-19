const express = require('express'); // Express app
const router = express.Router(); // Express router
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// Import controller
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.sendStatus(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth param to the decoded object
    });
    next(); // We need to continue or this will hang forever
}


// Define routes
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);
    
router
    .route('/trips')
    .get(tripsController.tripsList) // Protect this route with JWT
    .post(authenticateJWT, tripsController.tripsAddTrip); // Protect this route with JWT

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // Protect this route with JWT
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // Protect this route with JWT

module.exports = router;
