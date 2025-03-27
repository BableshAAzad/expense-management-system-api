let express = require('express');
let expenseService = require("../services/expenseService.js");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware.js")

//& Protected Routes
// router.delete("/users/:deleteUserId", checkUserAuth, userService.deleteUserById);
// router.get("/users", checkUserAuth, userService.users);
// router.get("/users/:userId",checkUserAuth, userService.getUserDetailById);

// * pubic routes
router.post("/expense/categories", checkUserAuth, expenseService.addExpenseCategories);
router.get("/expense/categories", checkUserAuth, expenseService.getAllExpenseCategories);
router.put("/expense/categories", checkUserAuth, expenseService.updateExpenseCategory);
router.get("/expense/categories/:expenseCategoryId", checkUserAuth, expenseService.getExpenseCategoryById);
router.delete("/expense/categories/:expenseCategoryId", checkUserAuth, expenseService.deleteExpenseCategoryById);

module.exports = router