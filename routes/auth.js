const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");

router.post("/", async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email : req.body.email})
    if(!user) return res.status(400).send('invalid username or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('invalid username or password');

    const token = await user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required()
    })
    return schema.validate(req)
}

module.exports = router;