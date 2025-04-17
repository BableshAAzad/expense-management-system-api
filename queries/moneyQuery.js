
module.exports.findSourceOfMoneyCategoryByCategoryNameQuery = function () {
    return `SELECT
                sourceOfMoneyCategoryId,
                sourceOfMoneyCategoryName
            FROM
                expense_categories
            WHERE 
                deleteFlag = 0
                AND
                sourceOfMoneyCategoryName = ?
            ;`;
}


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
