//api/routes/calculus.js
"use strict"

//Loading Dependencies =============================================
var express    = require("express")
var router     = express.Router()
var controller = require("../controllers/calculus")


//calculus routes
router.post("/calculus", controller.createCalculus)
router.put("/calculus", controller.updateCalculus)
router.delete("/calculus", controller.deleteCalculus)
router.get("/calculus/:id", controller.getCalculus)
router.get("/calculi", controller.getCalculi)


module.exports = router