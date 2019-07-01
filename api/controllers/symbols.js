//api/controllers/symbols
"use strict"

//Loading Dependencies =============================================
var Symbols = require("../models/symbols")



//fetching a symbols
function getSymbols (req, res) {
    //looking up the symbols
    Symbols.findOne({}, function (err, symbols) {
  
        //if the symbols does not exist
        if (err || symbols == null) {
            return res.status(400).json({
                "status"  : "failure",
                "message" : "symbols does not exist"
            })
        }

        //return the symbols 
        return res.status(200).json({
            "status"  : "success",
            "symbols" : symbols
        })
    })
}


//updating a symbols
function updateSymbols (req, res) {
    var query = {},
        update = JSON.parse(req.body.update),
        options = { upsert: true, new: true, setDefaultsOnInsert: true }
    console.log("update")
    console.log(Object.update)

    //looking up the symbols and updating it
    Symbols.findOneAndUpdate(query, update, options, 
        function (err, symbols) {
            //if the symbols does not exist
            if (err || symbols == null) {
                return res.status(400).json({
                    "status"  : "failure",
                    "message" : "symbols does not exist"
                })
            }

            //send back the updated symbols 
            return res.status(200).json({
                "status"  : "success",
                "symbols" : symbols
            })
        })
}


module.exports = {getSymbols, updateSymbols}
