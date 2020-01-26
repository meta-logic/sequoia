//api/routes/symbols.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/symbols")


//symbols routes
router.post("/symbols", controller.addSymbol)
router.post("/symbols_init", controller.addSymbols)
router.delete("/symbols", controller.deleteSymbol)
router.get("/rule_symbols/:calc_id", controller.getRuleSymbols)
router.get("/seq_symbols/:calc_id", controller.getSeqSymbols)
router.get("/cert_symbols/:calc_id", controller.getCertainSymbols)


module.exports = router