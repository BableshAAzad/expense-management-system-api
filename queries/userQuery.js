
module.exports.findUserInfoByUsernameQuery = function () {
    return `SELECT
                userId,
                username,
                role,
                password
            FROM
                users
            WHERE 
                deleteFlag = 'N'  
                AND
                username = ?
            ;`;
}

module.exports.findUserInfoByEmailQuery = function () {
    return `SELECT
                userId,
                username,
                role,
                password
            FROM
                users
            WHERE 
                deleteFlag = 'N'  
                AND
                email = ?
            ;`;
}

module.exports.findUserInfoByUserIdQuery = function () {
    return `SELECT
                userId,
                username,
                role,
                email
            FROM
                users
            WHERE 
                deleteFlag = 'N'  
                AND
                userId = ?
            ;`;
}

module.exports.getAllUsersQuery = function () {
    return `SELECT
                userId,
                email,
                username,
                role,
                createdDate
            FROM
                users
            WHERE 
                deleteFlag = 'N'
            ;`;
}


// CREATE TABLE expense_management_system.users (
//     userId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(200) NOT NULL,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     password VARCHAR(150) NOT NULL,
//     termAndCondition BOOLEAN NULL,
//     role VARCHAR(100) NOT NULL,
//     createdBy INT NULL,
//     createdDate DATETIME NULL,
//     modifiedDate DATETIME NULL,
//     modifiedBy INT NULL,
//     deleteFlag CHAR(1) NOT NULL,
//     deletedBy INT NULL,
//     deletedDate DATETIME NULL
// );


// CREATE TABLE expense_management_system.files (
//     fileId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     fileName VARCHAR(200) NOT NULL,
//     createdBy INT NULL,
//     createdDate DATETIME NULL,
//     modifiedDate DATETIME NULL,
//     modifiedBy INT NULL,
//     deleteFlag CHAR(1) NOT NULL,
//     deletedBy INT NULL
// );

// CREATE TABLE expense_management_system.contents (
//     contentId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     content LONGTEXT NOT NULL,
//     createdBy INT NULL,
//     createdDate DATETIME NULL,
//     modifiedDate DATETIME NULL,
//     modifiedBy INT NULL,
//     deleteFlag CHAR(1) NOT NULL,
//     deletedBy INT NULL
// );
