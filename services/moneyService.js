let MONEY_QUERY = require("../queries/moneyQuery.js");
let COMMON_QUERY = require("../queries/commonQuery.js");
let sourceOfMoneyCategoryValidator = require("../validator/moneyValidator.js");

let moneyService = {

    // ^----------------------------------------------------------------------------------------------------------------
    // TODO under process
    addMoney: async (req, res) => {
        let { expenseCategoryName } = req.body;
        let { user } = req;

        try {
            const pool = await getPool();
            let query = EXPENSE_QUERY.findExpenseCategoryByCategoryNameQuery();
            const [result] = await pool.promise().query(query, [expenseCategoryName]);
            let expenseCategory = result[0];
            if (expenseCategory) {
                return res.status(400).send({ error: "Expense Category already exist" });
            } else {
                const { error } = expenseCategoryValidator.expenseCategoryForSave({
                    expenseCategoryName: expenseCategoryName
                });
                if (error) {
                    res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
                    return;
                }
                try {
                    // new Expense category object
                    const newExpenseCategory = {
                        expenseCategoryName: expenseCategoryName,
                        createdBy: user.userId,
                        createdDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
                        deleteFlag: 0
                    };

                    // Save the new category in the database
                    const saveQuery = COMMON_QUERY.saveDataQuery("expense_categories", newExpenseCategory);

                    const [insertResult] = await pool.promise().query(saveQuery);

                    if (insertResult.affectedRows === 1) {
                        return res.status(201).send({ message: `Expense Category added` });
                    } else {
                        return res.status(500).send({ error: "Data insertion failed" });
                    }
                } catch (error) {
                    console.log("error during save expense category : ", error);
                    return res.status(400).send({ error: error.message });
                }
            }
        } catch (error) {
            console.log("error during fetch expense category Info : ", error);
            return res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    addSourceOfMoneyCategory: async (req, res) => {
        let { sourceOfMoneyCategoryName } = req.body;
        let { user } = req;

        try {
            const pool = await getPool();
            let query = MONEY_QUERY.findSourceOfMoneyCategoryByCategoryNameQuery();
            const [result] = await pool.promise().query(query, [sourceOfMoneyCategoryName]);
            let sourceOfMoneyCategory = result[0];
            if (sourceOfMoneyCategory) {
                return res.status(400).send({ error: "Source of money Category already exist" });
            } else {
                const { error } = sourceOfMoneyCategoryValidator.sourceOfMoneyCategoryForSave({
                    sourceOfMoneyCategoryName: sourceOfMoneyCategoryName
                });
                if (error) {
                    res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
                    return;
                }
                try {
                    // new Source of money category object
                    const newSourceOfMoneyCategory = {
                        sourceOfMoneyCategoryName: sourceOfMoneyCategoryName,
                        createdBy: user.userId,
                        createdDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
                        deleteFlag: 0
                    };

                    // Save the new category in the database
                    const saveQuery = COMMON_QUERY.saveDataQuery("source_of_money_categories", newSourceOfMoneyCategory);

                    const [insertResult] = await pool.promise().query(saveQuery);

                    if (insertResult.affectedRows === 1) {
                        return res.status(201).send({ message: `Source of money Category added` });
                    } else {
                        return res.status(500).send({ error: "Data insertion failed" });
                    }
                } catch (error) {
                    console.log("error during save Source of money category : ", error);
                    return res.status(400).send({ error: error.message });
                }
            }
        } catch (error) {
            console.log("error during fetch Source of money category Info : ", error);
            return res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    // ^----------------------------------------------------------------------------------------------------------------
    // ^----------------------------------------------------------------------------------------------------------------
    // ^----------------------------------------------------------------------------------------------------------------

}

module.exports = moneyService;