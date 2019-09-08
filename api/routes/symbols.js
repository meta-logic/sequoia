//api/routes/symbols.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/symbols")


//symbols routes
router.post("/symbols", controller.addSymbol)
router.delete("/symbols", controller.deleteSymbols)


module.exports = router