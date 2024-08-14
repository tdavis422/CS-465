const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async(req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: ''
    });
    user.setPassword(req.body.password);
    const q = await user.save();

    if(!q) {
        return res.status(400).json(err);
    } else {
        const token = user.generateJWT();
        return res.status(200).json(token);
    }
};

const login = (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({"message":"All fields required"});
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(404).json(err);
        }
        if(user) {
            const token = user.generateJWT();
            return res.status(200).json({token});
        } else {
            return res.status(401).json(info);
        }
    }) (req, res);
};

module.exports = {
    register,
    login
};