// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema


//defining the calculus schema
var calculusSchema = new Schema({
    title       : String,
    description : String, 
    rules       : [String], 
    symbols     : [String],
    user        : String
})

module.exports = mongoose.model("Calculus", calculusSchema)