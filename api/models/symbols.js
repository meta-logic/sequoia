// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


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