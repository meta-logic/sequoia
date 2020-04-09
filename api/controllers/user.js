// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var bcrypt = require('bcrypt')
var User = require("../models/user")
var Calculus = require("../models/calculus")
var Rule = require("../models/rule")
var Symbols = require("../models/symbols")


async function createUser (req, res) {
    var user  = new User()
    user.username = req.body.username
    user.password = await bcrypt.hash(req.body.password, 10)
    user.email = req.body.email
    user.occupation = req.body.occupation
    user.save(function (err) {
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the user"
            })
        }
        return res.status(200).json({
            "status"     : "success",
            "message"    : "user was created",
            "user"       : user 
        })
    }) 
}


function deleteUser (req, res) {
    User.deleteOne({_id : req.body.id}, function (err, user) {
        Calculus.remove({user : req.body.id}, function (err, clcs) {})
        Symbols.remove({user : req.body.id}, function (err, symbs) {})
        Rule.remove({user : req.body.id}, function (err, rls) {})
        if (err || user == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "user does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "user successfully deleted"
        })
    })
}


function getUser (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err || user == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "user does not exist"
            })
        }
        return res.status(200).json({
            "status"    : "success",
            "user"      : user
        })
    })
}


function checkUser (req, res) {
    User.find({'username' : req.params.username}, function (err, user) {
        if (user.length == 0) {
            return res.status(200).json({
                "status"  : "failure",
                "message" : "user does not exist"
            })
        }
        return res.status(200).json({
            "status"    : "success",
            "user"      : user
        })
    })
}


module.exports = {createUser, deleteUser, getUser, checkUser}