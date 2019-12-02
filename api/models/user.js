//api/models/users.js
"use strict"

//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema


//defining the calculus schema
var userSchema = new Schema({
    username    : String,
    password    : String, 
    email       : String,
    occupation  : String,
    calculi     : [String]
})

module.exports = mongoose.model("User", userSchema)