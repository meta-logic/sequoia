// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var mongoose = require("mongoose")
var Schema   = mongoose.Schema


//defining the rule schema
var ruleSchema = new Schema({
    rule        : String,
    premises    : [String],
    conclusion  : String,
    sml_prem    : [String],
    sml_conc    : String,
    calculus    : String,
    connective  : String,
    type        : String,
    side        : String
})

module.exports = mongoose.model("Rule", ruleSchema)
