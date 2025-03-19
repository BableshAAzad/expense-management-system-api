let USER_QUERY = require("../queries/userQuery.js");
const sql = require('mysql2');
const { dbConfig } = require('../config/dbConfig.js');  // assuming your DB config is in config.js

let usernameGenerate = async (email) => {
    const str = email.split("@");
    let username = str[0];
    let temp = 0;
    let pool;
    try {
        pool = sql.createPool(dbConfig); // Create pool instead of ConnectionPool for MySQL
        const [result] = await pool.promise().query(USER_QUERY.findUserInfoByUsernameQuery(), [username]);

        let user = result;  // MySQL result is returned as an array
        if (user.length > 0) {
            do {
                username = `${str[0]}${temp}`;
                temp++;

                // Check again for the username
                const [newResult] = await pool.promise().query(USER_QUERY.findUserInfoByUsernameQuery(), [username]);
                user = newResult;

            } while (user.length > 0);  // If user exists with that username, increment temp and try again
        }
        return username;
    } catch (error) {
        console.log("Error during username generation: ", error);
        throw new Error(error.message); // Return the error properly to be handled by caller
    } finally {
        // Close connection pool when done
        if (pool) {
            await pool.end();  // Use pool.end() to properly close the pool
        }
    }
}


// Create a global connection pool that will be reused across the app
let pool;
const getPool = async () => {
    if (!pool) {
        pool = new sql.createPool(dbConfig);
        await pool.promise().getConnection(); 
    }
    return pool;
};


module.exports = { usernameGenerate, getPool }
