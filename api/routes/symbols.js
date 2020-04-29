// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


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
router.get("/parsing_symbols/:calc_id", controller.getParsingSymbols)
router.get("/cert_symbols/:calc_id", controller.getCertainSymbols)


module.exports = router