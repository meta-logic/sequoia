//api/models/rule.js
"use strict"

//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema


//defining the rule schema
var ruleSchema = new Schema({
    rule       : String,
    premises   : [String],
    conclusion : String,
    sml_prem   : [String],
    sml_conc   : String
})

module.exports = mongoose.model("Rule", ruleSchema)
