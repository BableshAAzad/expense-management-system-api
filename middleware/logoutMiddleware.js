const dotenv = require("dotenv");
//! invoke dotenv
dotenv.config();

// Logout route
let logout = async (req, res) => {
    const authorization = req.headers.cookie;
    // console.log(authorization)

    let token;
    // Extract 'token' from cookie
    if (authorization) {
        const cookies = authorization.split('; ');
        cookies.forEach(cookie => {
            if (cookie.startsWith('token=')) {
                token = cookie.split('=')[1];
            }
        });
    }

    if (token) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || "development",
            sameSite: 'strict',
        });
        res.status(200).send({ message: 'Logout successful done' });
    } else {
        res.status(500).send({ error: "Please login first" })
    }
};

module.exports = logout;
