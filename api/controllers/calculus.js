//api/controllers/calculus
"use strict"

//Loading Dependencies =============================================
var Calculus = require("../models/calculus")
var Rule = require("../models/rule")
var Symbols = require("../models/symbols")


//creating a calculus
function createCalculus (req, res) {
    var calculus = new Calculus()
    //populating the calculus model with the rules and symbols from the reuest body
    calculus.title = req.body.title
    calculus.description = req.body.description
    calculus.rules = []
    calculus.symbols = []
    calculus.user = req.body.user
    //saving the calculus in the database
    calculus.save(function (err) {
        //if something went wrong while saving, return the error
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the calculus"
            })
        }
        //send success message and created calculus
        return res.status(200).json({
            "status"     : "success",
            "message"    : "calculus was created",
            "calculus"   : calculus   
        })
    }) 
}


//updating a calculus
function updateCalculus (req, res) {
    //looking up the calculus and updating it
    Calculus.findOneAndUpdate({ _id : req.params.id}, 
        { rules : JSON.parse(req.body.rules), symbols :  JSON.parse(req.body.symbols)}, { new : true}, 
        function (err, calculus) {
            //if the calculus does not exist
            if (err || calculus == null) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "calculus does not exist"
                })
            }
            //send back the updated calculus 
            return res.status(200).json({
                "status"    : "success",
                "calculus"  : calculus
            })
        })
}


//deleting a calculus
function deleteCalculus (req, res) {
    //deleting a calculus
    Calculus.deleteOne({ _id : req.body.id}, function (err, calc) {
        Symbols.remove({calculus : req.body.id}, function (err, symbs) {})
        Rule.remove({ calculus : req.body.id}, function (err, rls) {})
        //if the calculus does not exist
        if (err || calc == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "calculus does not exist"
            })
        }
        //calculus deleted
        return res.status(200).json({
            "status"  : "success",
            "message" : "calculus successfully deleted"
        })
    })
}


//fetching a calculus
function getCalculus (req, res) {
    //looking up the calculus
    Calculus.findById(req.params.calc_id, function (err, calculus) {
        //if the calculus does not exist
        if (err || calculus == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "calculus does not exist"
            })
        }
        //return the calculus 
        return res.status(200).json({
            "status"    : "success",
            "calculus"  : calculus
        })
    })
}


function getCalculi (req, res) {
    //looking up the calculus
    Calculus.find({user : req.params.user_id}, function (err, calculi) {
        //if the calculi do not exist
        if (err || calculi == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : err
            })
        }
        //return the calculus 
        return res.status(200).json({
            "status"      : "success",
            "calculi"  : calculi
        })
    })
}


module.exports = {createCalculus, updateCalculus, deleteCalculus, getCalculus, getCalculi}