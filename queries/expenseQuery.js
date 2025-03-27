
module.exports.findExpenseCategoryByCategoryNameQuery = function () {
    return `SELECT
                expenseCategoryId,
                expenseCategoryName
            FROM
                expense_categories
            WHERE 
                deleteFlag = 'N'  
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
                deleteFlag = 'N'  
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
                deleteFlag = 'N'  
            ;`;
}




// CREATE TABLE expense_management_system.expense_categories (
//     expenseCategoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     expenseCategoryName VARCHAR(200) NOT NULL UNIQUE,
//     createdBy BIGINT NOT NULL,
//     createdDate DATETIME NOT NULL,
//     modifiedBy BIGINT NULL,
//     modifiedDate DATETIME NULL,
//     deleteFlag CHAR(1) NOT NULL,
//     deletedDate DATETIME NULL,
//     deletedBy BIGINT NULL
// );