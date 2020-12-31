const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')

mongoose.connect('mongodb://localhost/vidley' , { useNewUrlParser: true , useUnifiedTopology: true})
.then(()=> console.log('Connected To MongoDB..........! Great'))
.catch(()=> console.log("Could Not Connect To MonogoDB...... ! Wrong"))

app.use(express.json())
app.use('/api/genres' , genres)
app.use('/api/customers' , customers)
app.use('/api/movies' , movies)
app.use('/api/rentals' , rentals)


app.listen(3000, () => console.log("Server Is Up And Running On Port 3000....!"));