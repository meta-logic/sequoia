// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var Rule = require("../models/rule")


function createRule (req, res) {
    var rule = new Rule()
    rule.rule      = req.body.rule
    rule.premises  = JSON.parse(req.body.premises)
    rule.conclusion = req.body.conclusion
    rule.sml_prem = JSON.parse(req.body.parsed_prem)
    rule.sml_conc = req.body.parsed_conc
    rule.calculus = req.body.calculus
    rule.connective = req.body.connective
    rule.type = req.body.type
    rule.side = req.body.side
    rule.save(function (err) {
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the rule"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "rule was created",
            "rule"    : rule   
        })
    }) 
}


function createRules (req, res) {
    var rules = JSON.parse(req.body.items)
    for (var i = 0; i < rules.length; i++) {
        var rule = new Rule()
        var rls = rules[i]
        rule.rule = rls.rule
        rule.premises  = JSON.parse(rls.premises)
        rule.conclusion = rls.conclusion
        rule.sml_prem = JSON.parse(rls.parsed_prem)
        rule.sml_conc = rls.parsed_conc
        rule.calculus = rls.calculus
        rule.connective = rls.connective
        rule.type = rls.type
        rule.side = rls.side
        rule.save(function (err) {
            if (err) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "something went wrong while creating the rule"
                })
            }
        }) 
    }
    return res.status(200).json({
        "status"  : "success",
        "message" : "rule was created",
        "rule"    : rule   
    })
}


function updateRule (req, res) {
    Rule.findOneAndUpdate({ _id : req.body.id}, 
        {   rule : req.body.rule, 
            premises : JSON.parse(req.body.premises), 
            conclusion : req.body.conclusion, 
            sml_prem : JSON.parse(req.body.parsed_prem),
            sml_conc : req.body.parsed_conc,
            calculus : req.body.calculus,
            connective : req.body.connective,
            side : req.body.side,
            type : req.body.type
        }, { new : true}, 
        function (err, rule) {
            if (err || rule == null) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "rule does not exist"
                })
            }
            return res.status(200).json({
                "status" : "success",
                "rule"   : rule
            })
        })
}


function deleteRule (req, res) {
    Rule.remove({ _id : req.body.id}, function (err, rule) {
        //if the rule does not exists
        if (err || rule == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rule does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "rule successfully deleted",
            "rule"    : rule
        })
    })
}


function getRule (req, res) {
    Rule.findById(req.params.rule_id, function (err, rule) {
        if (err || rule == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rule does not exist"
            })
        }
        return res.status(200).json({
            "status" : "success",
            "rule"   : rule
        })
    })
}


function getRules (req, res) {
    Rule.find({'calculus': req.params.calc_id}, function (err, rules) {
        if (err || rules == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "rules do not exist"
            })
        }
        return res.status(200).json({
            "status" : "success",
            "rules"   : rules
        })
    })
}


module.exports = {createRule, createRules, updateRule, deleteRule, getRule, getRules}
