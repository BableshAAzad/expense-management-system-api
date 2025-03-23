const jwt = require('jsonwebtoken');
let { getPool } = require("../services/common.js");
let USER_QUERY = require("../queries/userQuery.js");

const checkUserAuth = async (req, res, next) => {
    const authorization = req.headers.cookie;

    let token;
    // Extract token from cookies
    if (authorization) {
        const cookies = authorization.split('; ');
        cookies.forEach(cookie => {
            if (cookie.startsWith('token=')) {
                token = cookie.split('=')[1];
            }
        });
    }

    try {
        // Log extracted tokens
        // console.log('Token:', token);

        // Validate Token
        if (token) {
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (userId) {
                // Get the pool from the global pool function
                const pool = await getPool();
                let query = USER_QUERY.findUserInfoByUserIdQuery();
                const [result] = await pool.promise().query(query, [userId]);
                let user = result[0];

                if (!user) {
                    return res.status(404).send({ error: "Invalid token, season expired" });
                }
                req.user = {
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
                return next();
            } else {
                return res.status(404).send({ error: "User unauthorized-)-)-)-)" });
            }
        }
        // If both tokens are invalid
        throw new Error("Unauthorized User+=+=+=+");

    } catch (error) {
        console.error(error);
        res.status(401).send({ error: "Unauthorized User-|-|-|-|-" });
    }
};

module.exports = checkUserAuth;
