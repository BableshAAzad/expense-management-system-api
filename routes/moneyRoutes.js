let express = require('express');
let moneyService = require("../services/moneyService.js");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware.js");

//& Protected Routes
router.post("/add-money", checkUserAuth, moneyService.addMoney);


router.post("/add-source-of-money-category", checkUserAuth, moneyService.addSourceOfMoneyCategory);
router.get("/get-all-source-of-money-categories", checkUserAuth, moneyService.getAllSourceOfMoneyCategories);
router.put("/update-source-of-money-category", checkUserAuth, moneyService.updateSourceOfMoneyCategory);
router.delete("/delete-source-of-money-category/:sourceOfMoneyCategoryId", checkUserAuth, moneyService.deleteSourceOfMoneyCategory);


// * pubic routes



module.exports = router