//api/models/calculus.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


//defining the calculus schema
var calculusSchema = new Schema({
	title       : String,
	description : String, 
	rules       : [String], 
	symbols     : [{
		symbol     : String,
		type       : String,
		precedence : Number
	}]
});

module.exports = mongoose.model('Calculus', calculusSchema);