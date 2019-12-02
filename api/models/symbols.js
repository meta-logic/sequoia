//api/models/symbols.js
"use strict"

//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema


//defining the rule schema
var symbolSchema = new Schema({
    symbol      : String,
    type        : String,
    group       : String,
    calculus    : String
})

module.exports = mongoose.model("Symbols", symbolSchema)