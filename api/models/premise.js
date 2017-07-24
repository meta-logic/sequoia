//api/models/premise.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//defining the premise object
var premise = {
	atom           : Boolean,
	left           : [Schema.Types.Mixed],
	right          : [Schema.Types.Mixed],
	representation : String,
	connective     : {
		precedence     : Number,
		representation : String
	} 

};

module.exports = premise;