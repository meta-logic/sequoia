// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var Calculus = require("../models/calculus")
var Rule = require("../models/rule")
var Symbols = require("../models/symbols")


function createCalculus (req, res) {
    var calculus = new Calculus()
    calculus.title = req.body.title
    calculus.description = req.body.description
    calculus.rules = []
    calculus.symbols = []
    calculus.user = req.body.user
    calculus.save(function(err) {
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the calculus"
            })
        }
        return res.status(200).json({
            "status"     : "success",
            "message"    : "calculus was created",
            "calculus"   : calculus   
        })
    }) 
}


function updateCalculus (req, res) {
    Calculus.findOneAndUpdate({ _id : req.body.id}, 
        {   title : req.body.title, 
            description :req.body.description
        }, { new : true}, 
        function(err, calculus) {
            if (err || calculus == null) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "calculus does not exist"
                })
            }
            return res.status(200).json({
                "status"   : "success",
                "calculus" : calculus
            })
        })
}


function deleteCalculus (req, res) {
    Calculus.deleteOne({ _id : req.body.id}, function(err, calc) {
        Symbols.remove({calculus : req.body.id}, function(err, symbs) {})
        Rule.remove({ calculus : req.body.id}, function(err, rls) {})
        if (err || calc == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "calculus does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "calculus successfully deleted"
        })
    })
}


function getCalculus (req, res) {
    Calculus.findById(req.params.calc_id, function(err, calculus) {
        if (err || calculus == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "calculus does not exist"
            })
        }
        return res.status(200).json({
            "status"    : "success",
            "calculus"  : calculus
        })
    })
}


function getCalculi (req, res) {
    Calculus.find({user : req.params.user_id}, function(err, calculi) {
        if (err || calculi == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : err
            })
        }
        return res.status(200).json({
            "status"   : "success",
            "calculi"  : calculi
        })
    })
}


module.exports = {createCalculus, updateCalculus, deleteCalculus, getCalculus, getCalculi}