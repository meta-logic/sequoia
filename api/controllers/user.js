//api/controllers/calculus
"use strict"

//Loading Dependencies =============================================
var bcrypt = require('bcrypt')
var User = require("../models/user")
var Calculus = require("../models/calculus")
var Rule = require("../models/rule")
var Symbols = require("../models/symbols")


//creating a User
function createUser (req, res) {
    var user  = new User()
    
    user.username = req.body.username
    var pswd = bcrypt.hash(req.body.password, 2)
    user.password = pswd
    //saving the user in the database
    user.save(function (err) {
        //if something went wrong while saving, return the error
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the user"
            })
        }
        //send success message and created calculus
        return res.status(200).json({
            "status"     : "success",
            "message"    : "user was created",
            "user"       : user 
        })
    }) 
}


//deleting a User
function deleteUser (req, res) {
    //deleting a user
    User.deleteOne({ _id : req.body.id}, function (err, user) {
        Calculus.remove({user : req.body.id}, function (err, clcs) {})
        Symbols.remove({user : req.body.id}, function (err, symbs) {})
        Rule.remove({user : req.body.id}, function (err, rls) {})
        //if the user does not exist
        if (err || user == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "user does not exist"
            })
        }
        //user deleted
        return res.status(200).json({
            "status"  : "success",
            "message" : "user successfully deleted"
        })
    })
}


//fetching a user
function getUser (req, res) {
    //looking up the user
    User.findById(req.params.calc_id, function (err, user) {
        //if the user does not exist
        if (err || user == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "calculus does not exist"
            })
        }
        //return the user 
        return res.status(200).json({
            "status"    : "success",
            "user"      : user
        })
    })
}


module.exports = {createUser, deleteUser, getUser}