let express = require('express');
let moneyService = require("../services/moneyService.js");
const router = express.Router();
// const checkUserAuth = require("../middleware/authMiddleware.js");

//& Route Level Middleware - To Protect Route


//& Protected Routes

// * pubic routes
router.post("/add-money", moneyService.addMoney);
router.post("/add-source-of-money-category", moneyService.addSourceOfMoneyCategory);


module.exports = router