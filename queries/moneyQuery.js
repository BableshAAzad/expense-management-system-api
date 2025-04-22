
module.exports.findSourceOfMoneyCategoryByCategoryNameQuery = function () {
    return `SELECT
                sourceOfMoneyCategoryId,
                sourceOfMoneyCategoryName
            FROM
                source_of_money_categories
            WHERE 
                deleteFlag = 0
                AND
                sourceOfMoneyCategoryName = ?
            ;`;
}


module.exports.findSourceOfMoneyCategoryByIdQuery = function () {
    return `SELECT
                sourceOfMoneyCategoryId,
                sourceOfMoneyCategoryName
            FROM
                source_of_money_categories
            WHERE 
                deleteFlag = 0
                AND
                sourceOfMoneyCategoryId = ?
            ;`;
}

module.exports.getAllSourceOfTheMoneyCategoriesQuery = function () {
    return `
        SELECT
            sourceOfMoneyCategoryId,
            sourceOfMoneyCategoryName
        FROM
            source_of_money_categories
        WHERE 
            deleteFlag = 0
        ORDER BY 
            sourceOfMoneyCategoryName ASC;
    `;
};


// CREATE TABLE expense_management_system.source_of_money_categories (
//     sourceOfMoneyCategoryId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     sourceOfMoneyCategoryName VARCHAR(200) NOT NULL UNIQUE,
//     createdBy BIGINT NOT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedBy BIGINT DEFAULT NULL,
//     modifiedDate DATETIME DEFAULT NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedDate DATETIME DEFAULT NULL,
//     deletedBy BIGINT DEFAULT NULL
// );


/**
 * TODO create table for money 
 * 
 * transactionId
 * userId
 * 
 * sourceOfMoneyCategoryId
 * increment
 * 
 * expenseCategoryId
 * decrement
 * 
 * totalMoney
 * transactionDate
 * remark
 * 
 */