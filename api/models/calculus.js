//api/models/calculus.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


//defining the calculus schema
var calculusSchema = new Schema({
	rules   : [{
		id        : Number,
		upper_rep : [String],
		lower_rep : String
	}], 
	symbols : [{
		symbol     : String,
		type       : String,
		precedence : Number
	}]
});

module.exports = mongoose.model('Calculus', calculusSchema);