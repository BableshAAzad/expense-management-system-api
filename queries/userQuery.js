
module.exports.findUserInfoByUsernameQuery = function () {
    return `SELECT
                userId,
                username,
                role,
                password
            FROM
                users
            WHERE 
                deleteFlag = 0
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
                deleteFlag = 0
                AND
                email = ?
            ;`;
}

module.exports.findUserInfoByUserIdQuery = function () {
    return `SELECT
                u.userId,
                u.username,
                u.role,
                u.email,
                upi.fileName
            FROM
                users u
            LEFT JOIN
                user_profile_image upi
            ON u.userId = upi.userId AND upi.deleteFlag = 0
            WHERE 
                u.deleteFlag = 0
                AND
                u.userId = ?
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
                deleteFlag = 0
                AND
                role = ?
            ;`;
}

module.exports.findUserInfoByIdQuery = function () {
    return `SELECT
                userId,
                email,
                username,
                role
            FROM
                users
            WHERE 
                deleteFlag = 0
                AND
                userId = ?
;`;
}

module.exports.findUserProfileImageByIdQuery = function () {
    return `SELECT
                userId,
                fileName,
                oldImages
            FROM
                user_profile_image
            WHERE 
                deleteFlag = 0
                AND
                userId = ?
;`;
}


// CREATE TABLE expense_management_system.users (
//     userId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(200) NOT NULL,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     password VARCHAR(150) NOT NULL,
//     termAndCondition TINYINT(1) NOT NULL,
//     role VARCHAR(100) NOT NULL,
//     createdBy BIGINT NOT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedDate DATETIME NULL,
//     modifiedBy BIGINT NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedBy BIGINT NULL,
//     deletedDate DATETIME NULL
// );

// CREATE TABLE expense_management_system.user_profile_image (
//     profileImageId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     userId BIGINT NOT NULL,
//     fileName VARCHAR(200) NOT NULL,
//     createdBy BIGINT NOT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedBy BIGINT NULL,
//     modifiedDate DATETIME NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedDate DATETIME NULL,
//     deletedBy BIGINT NULL,
//     CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(userId)
// );



// CREATE TABLE expense_management_system.files (
//     fileId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     fileName VARCHAR(200) NOT NULL,
//     createdBy INT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedDate DATETIME NULL,
//     modifiedBy INT NULL,
//     deletedDate DATETIME NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedBy INT NULL
// );

// CREATE TABLE expense_management_system.contents (
//     contentId BIGINT AUTO_INCREMENT PRIMARY KEY,
//     content LONGTEXT NOT NULL,
//     createdBy INT NULL,
//     createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modifiedDate DATETIME NULL,
//     modifiedBy INT NULL,
//     deleteFlag TINYINT(1) NOT NULL,
//     deletedBy INT NULL
// );
