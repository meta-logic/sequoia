//api/controllers/symbols.js
"use strict"

//Loading Dependencies =============================================
var Symbols = require("../models/symbols")


//adding a symbol
function addSymbol (req, res) {
    var symbol = new Symbols()
    symbol.symbol     = req.body.symbol
    symbol.type       = req.body.type
    symbol.group      = req.body.group
    symbol.save(function (err) {

        //if something went wrong while saving, return the error
        if (err) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "something went wrong while creating the symbol"
            })
        }
        //send success message and created rule
        return res.status(200).json({
            "status"  : "success",
            "message" : "symbol was created",
            "symbol"    : symbol  
        })
    }) 
}


//deleting a symbol
function deleteSymbols (req, res) {
    //deleting a symbol

    Symbols.remove({symbol : req.body.symbol}, function (err, symbol) {
        //if the symbol does not exists
        if (err || symbol == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbol does not exist"
            })
        }
        //rule deleted
        return res.status(200).json({
            "status"  : "success",
            "message" : "symbol successfully deleted",
            "rule"    : symbol
        })
    })
}


module.exports = {addSymbol, deleteSymbols}
