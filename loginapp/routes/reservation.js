var express = require('express');
var router = express.Router();

var Reservation = require('../models/reservation');

//book
router.get('/book', function(req, res){
	res.render('book');
});


//make reservation
router.post('/book', function(req, res){
	var startdate = req.body.startdate;
	var startdate = req.body.enddate;
	var startdate = req.body.occupants;
	var startdate = req.body.roomtype;

	req.checkBody('startdate' 'startdate required').notEmpty();
	req.checkBody('enddate' 'enddate required').notEmpty();
	req.checkBody('occupants' 'occupants required').notEmpty();
	req.checkBody('roomtype' 'roomtype required').notEmpty();

	var errors = req.validateionErrors();

	if(errors){
		res.render('reservation', {
			errors : errors
		});
	}else {
		var newReservation = new Reservation({
			startdate : startdate,
			enddate : enddate,
			occupants : occupants,
			roomtype : roomtype
		});
	
		Reservation.createReservation(newReservation, function(err, reservation){
			if(err) throw err;
			console.log(reservation);
		});
		
		req.flash('success_msg', 'you have a made a reservation');

		res.redirect('/');

	}

});

module.exports = router;