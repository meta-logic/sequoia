//api/controllers/rule.js
"use strict"

//Loading Dependencies =============================================
var Rule = require("../models/rule")


//creating a rule
function createRule (req, res) {
    var rule = new Rule()
    //populating the rule model with sequents and their connectives
    rule.rule      = req.body.rule
    rule.premises  = JSON.parse(req.body.premises)
    rule.conclusion = req.body.conclusion
    rule.sml_prem = JSON.parse(req.body.parsed_prem)
    rule.sml_conc = req.body.parsed_conc
    rule.calculus = req.body.calculus
    rule.connective = req.body.connective
    rule.side = req.body.side
    
    //saving the rule in the database
    rule.save(function (err) {
        //if something went wrong while saving, return the error
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the rule"
            })
        }
        //send success message and created rule
        return res.status(200).json({
            "status"  : "success",
            "message" : "rule was created",
            "rule"    : rule   
        })
    }) 
}


//updating a rule
function updateRule (req, res) {
    //looking up the rule and updating it
    Rule.findOneAndUpdate({ _id : req.body.id}, 
        {   rule : req.body.rule, 
            premises : JSON.parse(req.body.premises), 
            conclusion : req.body.conclusion, 
            sml_prem : JSON.parse(req.body.parsed_prem),
            sml_conc : req.body.parsed_conc,
            calculus : req.body.calculus,
            connective : req.body.connective,
            side : req.body.side
        }, { new : true}, 
        function (err, rule) {
            //if the rule does not exist
            if (err || rule == null) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "rule does not exist"
                })
            }
            //send back the updated rule 
            return res.status(200).json({
                "status" : "success",
                "rule"   : rule
            })
        })
}


//deleting a rule
function deleteRule (req, res) {
    //deleting a rule
    Rule.remove({ _id : req.body.id}, function (err, rule) {
        //if the rule does not exists
        if (err || rule == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rule does not exist"
            })
        }
        //rule deleted
        return res.status(200).json({
            "status"  : "success",
            "message" : "rule successfully deleted",
            "rule"    : rule
        })
    })
}


//fetching a rule
function getRule (req, res) {
    //looking up the rule
    Rule.findById(req.params.rule_id, function (err, rule) {
        //if the rule does not exist
        if (err || rule == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rule does not exist"
            })
        }
        //return the rule 
        return res.status(200).json({
            "status" : "success",
            "rule"   : rule
        })
    })
}


//fetching rules of calc
function getRules (req, res) {
    //looking up the rules
    Rule.find({'calculus': req.params.calc_id}, function (err, rules) {
        //if the rules do not exist
        if (err || rules == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rules do not exist"
            })
        }
        //return the rules 
        return res.status(200).json({
            "status" : "success",
            "rules"   : rules
        })
    })
}


module.exports = {createRule, updateRule, deleteRule, getRule, getRules}
