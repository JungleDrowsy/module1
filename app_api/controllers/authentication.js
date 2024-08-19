const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport'); // Add this line to import passport

// Register function (already exists)
const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: ''
    });

    user.setPassword(req.body.password);
    
    try {
        const q = await user.save();

        if (!q) {
            return res
                .status(400)
                .json({ "message": "Failed to create user" });
        } else {
            const token = user.generateJWT();
            return res
                .status(200)
                .json({ "token": token });
        }
    } catch (err) {
        return res
            .status(400)
            .json(err);
    }
};

// Login function (new)
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            const token = user.generateJWT();
            return res
                .status(200)
                .json({ "token": token });
        } else {
            return res
                .status(401)
                .json(info);
        }
    })(req, res);
};

// Export methods that drive endpoints
module.exports = {
    register,
    login
};
