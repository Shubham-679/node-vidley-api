const { Rental, validateRental } = require('../models/rentalModel');
const { Movies } = require('../models/movieModel');
const { Customers } = require('../models/customerModel')
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);
 
router.get('/' , async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals)
})

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental)
      return res.status(404).send("The rental with the given ID was not found.");
  
    res.send(rental);
  });

router.post('/' , async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Invalid Customer!");

    const movie =  await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Invalid Movie!");

    if(movie.numberInStock===0) res.status(404).send("Movie out of stock")

    let rental = new Rental({
        customer : {
            _id : customer._id,
            name : customer.name,
            phone : customer.phone,
        },
        movie : {
            _id : movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    try {
        new Fawn.Task()
        .save('rentals' , rental)
        .update('movies', { _id: movie._id },{ $inc: { numberInStock: -1 }} )
        .run()
        res.send(rental);    
    } catch (ex) {
        res.status(500).send("Somthing Failed.!")
    }
    
})

module.exports = router;