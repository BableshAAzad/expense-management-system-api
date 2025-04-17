
module.exports.findExpenseCategoryByCategoryNameQuery = function () {
    return `SELECT
                expenseCategoryId,
                expenseCategoryName
            FROM
                expense_categories
            WHERE 
                deleteFlag = 0
                AND
                expenseCategoryName = ?
            ;`;
}

module.exports.findExpenseCategoryByIdQuery = function () {
    return `SELECT
                expenseCategoryId,
                expenseCategoryName
            FROM
                expense_categories
            WHERE 
                deleteFlag = 0
                AND
                expenseCategoryId = ?
            ;`;
}

module.exports.getAllExpenseCategoriesQuery = function () {
    return `SELECT
                expenseCategoryId,
                expenseCategoryName
            FROM
                expense_categories
            WHERE 
                deleteFlag = 0
            ;`;
}




// CREATE TABLE expense_management_system.expense_categories (
//     expenseCategoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     expenseCategoryName VARCHAR(200) NOT NULL UNIQUE,
//     createdBy BIGINT NOT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedBy BIGINT NULL,
//     modifiedDate DATETIME NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedDate DATETIME NULL,
//     deletedBy BIGINT NULL
// );