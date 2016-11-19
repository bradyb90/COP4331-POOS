var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var Reservation = require('../models/reservation');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

//book
router.get('/book', function(req, res){
	res.render('book');
});


//make reservation
router.post('/book', function(req, res){
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	var occupants = req.body.occupants;
	var roomtype = req.body.roomtype;

	req.checkBody('startdate', 'startdate required').notEmpty();
	req.checkBody('enddate', 'enddate required').notEmpty();
	req.checkBody('occupants', 'occupants required').notEmpty();
	req.checkBody('roomtype', 'roomtype required').notEmpty();

	var errors = req.validationErrors();

	console.log(req.app.locals.user.username);
	console.log(typeof(req.app.locals.user));

	if(errors){
		res.render('book', {
			errors : errors
		});
	}else {
		var newReservation = new Reservation({
			username : req.app.locals.user.username,
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


// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;