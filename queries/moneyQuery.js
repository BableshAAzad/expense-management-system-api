
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
//     sourceOfMoneyCategoryName VARCHAR(200) NOT NULL DEFAULT '',
//     commonCategory ENUM('P', 'C') NOT NULL DEFAULT 'P',
//     createdBy BIGINT NOT NULL DEFAULT 0,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedBy BIGINT NOT NULL DEFAULT 0 ,
//     modifiedDate DATETIME DEFAULT NULL,
//     deleteFlag TINYINT(1) NOT NULL DEFAULT 0,
//     deletedDate DATETIME DEFAULT NULL,
//     deletedBy BIGINT NOT NULL DEFAULT 0
// );




//  TODO create table for money 
// CREATE TABLE expense_management_system.money (
//     transactionId BIGINT AUTO_INCREMENT PRIMARY KEY,

//     userId BIGINT NOT NULL DEFAULT 0,
//     sourceOfMoneyCategoryId BIGINT NOT NULL DEFAULT 0,
//     expenseCategoryId BIGINT NOT NULL DEFAULT 0,

//     increment DOUBLE NOT NULL DEFAULT 0.0,
//     decrement DOUBLE NOT NULL DEFAULT 0.0,

//     totalMoney DOUBLE NOT NULL DEFAULT 0.0,
//     transactionDate DATETIME NOT NULL,
//     remark VARCHAR(300),

//     CONSTRAINT fk_user FOREIGN KEY (userId) 
//         REFERENCES users(userId),
    
//     CONSTRAINT fk_source_of_money_categories FOREIGN KEY (sourceOfMoneyCategoryId) 
//         REFERENCES source_of_money_categories(sourceOfMoneyCategoryId),
    
//     CONSTRAINT fk_expense_categories FOREIGN KEY (expenseCategoryId) 
//         REFERENCES expense_categories(expenseCategoryId)
// );


