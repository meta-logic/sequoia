//api/controllers/calculus
"use strict"

//Loading Dependencies =============================================
var Calculus = require("../models/calculus")
var Rule     = require("../models/rule")


//creating a calculus
function createCalculus (req, res) {
    var calculus = new Calculus()

    //populating the calculus model with the rules and symbols from the reuest body
    calculus.title = req.body.title
    calculus.description = req.body.description
    calculus.rules = []
    calculus.symbols = []

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

//fetching a calculus
function getCalculus (req, res) {
    //looking up the calculus
    Calculus.findById(req.params.id, function (err, calculus) {

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
    Calculus.remove({ _id : req.params.id}, function (err, calculus) {
        //if the calculus does not exist
        if (err || calculus == null) {
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


function getCalculuses (req, res) {
    var grule
    //looking up the calculus
    Calculus.find({}, function (err, calculuses) {

        //if the calculus does not exist
        if (err || calculuses == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : err
            })
        }

        for (var i = 0; i < calculuses.length; i++) {

            if (calculuses[i].rules.length > 0) {
                Rule.find ({_id : calculuses[i].rules[0]}, function (err, rule) {

                    //if the calculus does not exist
                    if (err || rule == null) {
                        return res.status(400).json({
                            "status"  : "failure",
                            "message" : err
                        })
                    }

                    console.log(calculuses[i])
                    console.log(rule)

                    grule = rule
					
                })

                console.log(grule)


            } else {
                calculuses[i].rule = ""
                calculuses[i].premises = ""
                calculuses[i].conclusion = ""
            }
        }
        //return the calculus 
        return res.status(200).json({
            "status"      : "success",
            "calculuses"  : calculuses
        })
    })
}

module.exports = {createCalculus, getCalculus, updateCalculus, deleteCalculus, getCalculuses}