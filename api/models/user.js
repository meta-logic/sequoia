// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


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