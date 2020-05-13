// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


//Loading Dependencies =============================================
var Symbols = require("../models/symbols")


function addSymbol (req, res) {
    var symbol = new Symbols()
    symbol.symbol     = req.body.symbol
    symbol.type       = req.body.type
    symbol.group      = req.body.group
    symbol.calculus   = req.body.calculus
    symbol.save(function(err) {
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the symbol"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "symbol was created",
            "symbol"  : symbol  
        })
    }) 
}


function addSymbols (req, res) {
    var symbols = JSON.parse(req.body.items)
    for (var i = 0; i < symbols.length; i++) {
        var symbol = new Symbols()
        var syms = symbols[i]
        symbol.symbol     = syms.symbol
        symbol.type       = syms.type
        symbol.group      = syms.group
        symbol.calculus   = syms.calculus
        symbol.save(function(err) {
            if (err) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "something went wrong while creating the symbol"
                })
            }
        }) 
    }
    return res.status(200).json({
        "status"  : "success",
        "message" : "symbol was created",
        "symbol"  : symbol  
    })
}


function deleteSymbol (req, res) {
    Symbols.remove({ _id : req.body.id}, function(err, symbol) {
        if (err || symbol == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "message" : "symbol successfully deleted",
            "rule"    : symbol
        })
    })
}


function getRuleSymbols (req, res) {
    Symbols.find({ $and: [{'calculus': req.params.calc_id}, {group : "rule"}]}, 
    function(err, symbols) {
        if (err || symbols == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "symbols" : symbols
        })
    })
}


function getSeqSymbols (req, res) {
    Symbols.find({ $and: [{'calculus': req.params.calc_id}, {group : "seq"}]}, 
    function(err, symbols) {
        if (err || symbols == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "symbols" : symbols
        })
    })
}


function getParsingSymbols (req, res) {
    Symbols.find({ $and: [{'calculus': req.params.calc_id}, 
    {$or:[{group: "seq"},{type : {$in: ["connective", "sequent sign", "context separator", "empty"]}}]}]}, 
    function(err, symbols) {
        if (err || symbols == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "symbols" : symbols
        })
    })
}


function getCertainSymbols (req, res) {
    Symbols.find({ $and: [{'calculus': req.params.calc_id}, 
    {type : {$in: ["connective", "sequent sign", "context separator", "empty"]}}]}, 
    function(err, symbols) {
        if (err || symbols == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        return res.status(200).json({
            "status"  : "success",
            "symbols" : symbols
        })
    })
}


module.exports = {addSymbol, addSymbols, deleteSymbol, getRuleSymbols, getSeqSymbols, getParsingSymbols, getCertainSymbols}