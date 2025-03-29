let EXPENSE_QUERY = require("../queries/expenseQuery.js");
let COMMON_QUERY = require("../queries/commonQuery.js");
let expenseCategoryValidator = require("../validator/expenseValidator.js");
let { getPool } = require("./common.js");
let format = require('date-format');

let expenseService = {
    // ^----------------------------------------------------------------------------------------------------------------
    addExpenseCategories: async (req, res) => {
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
                        deleteFlag: "N"
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
    getAllExpenseCategories: async (req, res, next) => {
        try {
            const pool = await getPool();
            let query = EXPENSE_QUERY.getAllExpenseCategoriesQuery();
            const [result] = await pool.promise().query(query);
            // let users = result.map(user => {
            //     let temp = { ...user, createdDate: format('yyyy-MM-dd hh:mm:ss', new Date(user.createdDate)) }
            //     return temp
            // })

            res.status(200).send(result)
        } catch (error) {
            console.log("error occurred during fetch expense categories : ", error);
            res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    updateExpenseCategory: () => {

    },
    // ^----------------------------------------------------------------------------------------------------------------
    getExpenseCategoryById: () => {

    },
    // ^----------------------------------------------------------------------------------------------------------------
    // TODO under process
    // deleteExpenseCategoryById: async (req, res, next) => {
    //     let { user } = req;
    //     let { expenseCategoryId } = req.params;

    //     const { error } = expenseCategoryValidator.expenseCategoryForDelete({
    //         expenseCategoryId: expenseCategoryId
    //     });
    //     if (error) {
    //         res.status(400).send({ error: `Validation Error: ${error.details[0].message}` });
    //         return;
    //     }
    //     try {
    //         const pool = await getPool();
    //         let query = EXPENSE_QUERY.findExpenseCategoryByIdQuery();
    //         const [result] = await pool.promise().query(query, [expenseCategoryId]);
    //         let deleteExpenseCategory = result[0];

    //         if (deleteExpenseCategory) {
    //             // updated User object
    //             const deleteExpenseCategoryObj = {
    //                 deletedDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
    //                 deleteFlag: "Y",
    //                 deletedBy: user.userId,
    //             }
    //             let condition = `ExpenseCategoryId = ${deleteExpenseCategoryId}`

    //             // Generate the update query
    //             const updateQuery = COMMON_QUERY.updateDataQuery('ExpenseCategorys', deleteExpenseCategoryObj, condition);

    //             // Execute the query using your MySQL pool (assuming pool is already configured)
    //             const [updateResult] = await pool.promise().query(updateQuery);

    //             // Check if the row was updated
    //             if (updateResult.affectedRows === 1) {
    //                 res.status(200).send({ message: "ExpenseCategory deleted successfully" });
    //             } else {
    //                 res.status(500).send({ error: "Failed to delete ExpenseCategory" });
    //             }
    //         } else {
    //             res.status(400).send({ error: "Invalid delete ExpenseCategory Id" });
    //         }
    //     } catch (error) {
    //         console.log("error during fetch ExpenseCategory Info : ", error);
    //         return res.status(400).send({ error: error.message });
    //     }
    // },
    // ^----------------------------------------------------------------------------------------------------------------
    // ^----------------------------------------------------------------------------------------------------------------
    // ^----------------------------------------------------------------------------------------------------------------
}

module.exports = expenseService