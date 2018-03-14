//api/models/symbols.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//defining the rule schema
var symbolsSchema = new Schema({
	symbols : Object
});

module.exports = mongoose.model('Symbols', ruleSchema);