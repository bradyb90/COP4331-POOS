var mongoose = require('mongoose');

// reservation schema
var ReservationSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	startdate : {
		startdate: Date
	},
	enddate: {
		enddate: Date
	},
	occupants: {
		occupants: String
	},
	roomtype: {
		roomtype: String
	}
});



var Reservation = module.exports = mongoose.model('Reservation', ReservationSchema);


module.exports.createReservation = function(newReservation, callback){
		newReservation.save(callback);
}
