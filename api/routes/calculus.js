//api/routes/calculus.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/calculus")


//calculus routes
router.post("/calculus", controller.createCalculus)
router.delete("/calculus", controller.deleteCalculus)
router.get("/calculus/:calc_id", controller.getCalculus)
router.get("/calculi/:user_id", controller.getCalculi)


module.exports = router