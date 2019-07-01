//api/models/rule.js
"use strict"

//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema
//var sequent  = require("./sequent")

//defining the rule schema
var ruleSchema = new Schema({
    rule       : String,
    premises   : [String],
    conclusion : String,
    extraArguments : [String]
})

module.exports = mongoose.model("Rule", ruleSchema)
