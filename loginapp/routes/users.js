var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

var User = require('../models/user');
	

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

//book
router.get('/book', loggedIn, function(req, res){
	res.render('book');
});

//creating manager and receptionist accounts
router.get('/changepermission', isManager, function(req,res){
	res.render('changepermission');
});

//checking in and out
router.get('/checkin', isReceptionist, function(req,res){
	res.render('checkin');
});

//homepage
router.get('/palace',  function(req,res){
	res.sendFile(path.join(__dirname + '/palace.html'));
});

//gallery link to html page
router.get('/gallery',  function(req,res){
	res.sendFile(path.join(__dirname + '/gallery.html'));
});

//events
router.get('/events',  function(req,res){
	res.sendFile(path.join(__dirname + '/events.html'));
});

//services

router.get('/palace',  function(req,res){
	res.sendFile(path.join(__dirname + '/palace.html'));
});

//check to see if user is at least a receptionist
function isReceptionist(req, res, next){
	if(req.app.locals.user.accountlevel == '3' || req.app.locals.user.accountlevel == '2'){
		return next();
	}else{
		res.redirect('/');
	}
}

//check manager permissions
function isManager(req, res, next){
	if(req.app.locals.user.accountlevel == '3'){
		return next();
	}else{
		res.redirect('/');
	}
}
//check to see if a user is logged in
function loggedIn(req, res, next){

	if(req.app.locals.user != null){
		return next();
	}else{
		res.redirect('login');
	}

}

//delete user
router.post('/deleteuser', function(req,res){
	var username = req.body.username;

	req.checkBody('username', 'username required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('changepermission', {
			errors: validationErrors
		});
	}else{
		User.findOne({username: username}, function(err, result){
			result.reservation = {startdate: none, enddate: none, occupants: none, roomtype: none};
			result.save();
		});
	}

});

//checkin
router.post('/checkin', function(req,res){
	var username = req.body.username;
	var check;

	req.checkBody('username', 'user required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('checkin', {
			errors: errors
		});
	}else{
		User.findOne( {username: username}, function(err, result){
			if(result.status == 'checkedout'){
				result.status = 'checkedin';
			}else{
				result.status = 'checkedout';
			}
			result.save();
		});
	}

	req.flash('success_msg', username + ' status change complete' );	

	res.redirect('/');

});

//change permissions
router.post('/changepermission', function(req, res){
	
	var newlevel = req.body.permission;
	var username = req.body.username;

	req.checkBody('username', 'user required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('changepermission', {
			errors: errors
		});
	}else{
		User.findOne( {username: username}, function(err, result){
			result.accountlevel = newlevel;
			result.save();
		});
	}
		
		req.flash('success_msg', 'you have changed permission');

		res.redirect('/');

});

//make reservation
router.post('/book', function(req, res){
	var startdate = req.body.startdate;
	var enddate = req.body.enddate;
	var occupants = req.body.occupants;
	var roomtype = req.body.roomtype;
	var username = req.app.locals.user.name;

	req.checkBody('startdate', 'startdate required').notEmpty();
	req.checkBody('enddate', 'enddate required').notEmpty();
	req.checkBody('occupants', 'occupants required').notEmpty();
	req.checkBody('roomtype', 'roomtype required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('book', {
			errors : errors
		});
	}else {
 		User.findOne( {username: username}, function(err,result){
			result.reservation = {startdate: startdate, enddate: enddate, occupants: occupants, roomtype: roomtype};
			result.save();
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