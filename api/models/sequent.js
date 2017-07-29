//api/models/sequent.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//defining the sequent object
var sequent = {
	atom           : Boolean,
	left           : [Schema.Types.Mixed],
	right          : [Schema.Types.Mixed],
	representation : String,
	connective     : {
		precedence     : Number,
		representation : String
	} 

};

module.exports = sequent;