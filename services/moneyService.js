let MONEY_QUERY = require("../queries/moneyQuery.js");
let COMMON_QUERY = require("../queries/commonQuery.js");
let { getPool } = require("./common.js");
let sourceOfMoneyCategoryValidator = require("../validator/moneyValidator.js");
let format = require('date-format');


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

        const { error } = sourceOfMoneyCategoryValidator.sourceOfMoneyCategoryForSave({
            sourceOfMoneyCategoryName: sourceOfMoneyCategoryName
        });
        if (error) {
            res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
            return;
        }

        try {
            const pool = await getPool();
            let query = MONEY_QUERY.findSourceOfMoneyCategoryByCategoryNameQuery();
            const [result] = await pool.promise().query(query, [sourceOfMoneyCategoryName]);
            let sourceOfMoneyCategory = result[0];
            if (sourceOfMoneyCategory) {
                return res.status(400).send({ error: "Source of money Category already exist" });
            } else {
                try {
                    // new Source of money category object
                    let newSourceOfMoneyCategory = {
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
            console.log("error during fetch Source of money source category Info : ", error);
            return res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    getAllSourceOfMoneyCategories: async (req, res, next) => {
        try {
            const pool = await getPool();
            let query = MONEY_QUERY.getAllSourceOfTheMoneyCategoriesQuery();
            const [result] = await pool.promise().query(query);

            res.status(200).send(result)
        } catch (error) {
            console.log("error occurred during fetch expense categories : ", error);
            res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    updateSourceOfMoneyCategory: async (req, res, next) => {
        const { sourceOfMoneyCategoryId, sourceOfMoneyCategoryName } = req.body;
        const { error } = sourceOfMoneyCategoryValidator.sourceOfMoneyCategoryForUpdate({
            sourceOfMoneyCategoryId: sourceOfMoneyCategoryId,
            sourceOfMoneyCategoryName: sourceOfMoneyCategoryName
        });
        if (error) {
            res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
            return;
        }
        let { user } = req;
        try {
            const pool = await getPool();
            let query = MONEY_QUERY.findSourceOfMoneyCategoryByIdQuery();
            const [result] = await pool.promise().query(query, [sourceOfMoneyCategoryId]);
            let sourceOfMoneyCategory = result[0];
            if (sourceOfMoneyCategory) {
                let updatedSourceOfMoneyCategory = {
                    sourceOfMoneyCategoryName: sourceOfMoneyCategoryName || sourceOfMoneyCategory.sourceOfMoneyCategoryName,
                    modifiedBy: user.userId,
                    modifiedDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
                };

                const saveQuery = COMMON_QUERY.updateDataQuery(
                    "source_of_money_categories",
                    updatedSourceOfMoneyCategory,
                    `sourceOfMoneyCategoryId=${sourceOfMoneyCategoryId}`
                );

                const [updateResult] = await pool.promise().query(saveQuery);

                if (updateResult.affectedRows === 1) {
                    return res.status(200).send({ message: `Source of money Category updated` });
                } else {
                    return res.status(500).send({ error: "Data update failed... try again" });
                }
            } else {
                return res.status(400).send({ error: "Source of money Category not exist" });
            }
        } catch (error) {
            console.log("error during update Source of money source category: ", error);
            return res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    deleteSourceOfMoneyCategory: async (req, res, next) => {
        const { sourceOfMoneyCategoryId } = req.params;
        const { error } = sourceOfMoneyCategoryValidator.sourceOfMoneyCategoryForDelete({
            sourceOfMoneyCategoryId: sourceOfMoneyCategoryId,
        });
        if (error) {
            res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
            return;
        }
        let { user } = req;
        try {
            const pool = await getPool();
            let query = MONEY_QUERY.findSourceOfMoneyCategoryByIdQuery();
            const [result] = await pool.promise().query(query, [sourceOfMoneyCategoryId]);
            let sourceOfMoneyCategory = result[0];
            if (sourceOfMoneyCategory) {
                let deleteSourceOfMoneyCategory = {
                    deletedBy: user.userId,
                    deletedDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
                    deleteFlag: 0
                };

                const saveQuery = COMMON_QUERY.updateDataQuery(
                    "source_of_money_categories",
                    deleteSourceOfMoneyCategory,
                    `sourceOfMoneyCategoryId=${sourceOfMoneyCategoryId}`
                );

                const [deleteResult] = await pool.promise().query(saveQuery);

                if (deleteResult.affectedRows === 1) {
                    return res.status(200).send({ message: `Source of money Category deleted` });
                } else {
                    return res.status(500).send({ error: "Data delete failed... try again" });
                }
            } else {
                return res.status(400).send({ error: "Source of money Category not exist" });
            }
        } catch (error) {
            console.log("error during delete Source of money source category: ", error);
            return res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------

}

module.exports = moneyService;