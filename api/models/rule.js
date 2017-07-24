//api/models/rule.js
'use strict';

//Loading Dependencies =============================================
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var premise  = require('./premise');

//defining the rule schema
var ruleSchema = new Schema({
	premises   : [premise],
	conclusion : premise
});

module.exports = mongoose.model('Rule', ruleSchema);