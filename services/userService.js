const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let USER_QUERY = require("../queries/userQuery.js");
let COMMON_QUERY = require("../queries/commonQuery.js")
let { usernameGenerate, getPool } = require("./common.js");
const CryptoJS = require("crypto-js");
let format = require('date-format');
var svgCaptcha = require('svg-captcha');


let userService = {
    // ^----------------------------------------------------------------------------------------------------------------
    login: async (req, res, next) => {
        let { username, password } = req.body;
        
        try {
            if (username && password) {
                const pool = await getPool();
                let query = USER_QUERY.findUserInfoByUsernameQuery();
                const [result] = await pool.promise().query(query, [username]);
                let user = result[0];

                if (user) {
                    let passwordDecryption = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

                    const isMatch = await bcrypt.compare(passwordDecryption, user.password);  // Using bcrypt to compare the password
                    if (isMatch) {
                        try {
                            // Generate JWT Token
                            const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

                            res.cookie('token', token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production' || "development",
                                // secure: true,
                                sameSite: 'strict',
                                maxAge: 5 * 24 * 60 * 60 * 1000 // Token expires in 5 days
                            });

                            res.status(200).send({
                                message: "Login successfully done",
                                data: {
                                    userId: user.userId,
                                    username: user.username,
                                    role: user.role,
                                    tokenExpiration: 5 * 24 * 60 * 60,
                                    token: token
                                }
                            });
                        } catch (error) {
                            console.log(error);
                            res.status(500).send({ error: error.message });
                        }
                    } else {
                        res.status(400).send({ error: "Login failed, User not validate" });
                    }
                } else {
                    res.status(400).send({ error: "Login failed, User not validate" });
                }
            } else {
                res.status(400).send({ error: "All fields are required, Please fill all fields properly..." });
            }
        } catch (error) {
            console.log("error during login : ", error);
            res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    registration: async (req, res) => {
        const { email, password, passwordConfirmation, termAndCondition } = req.body;

        // Get the pool from the global pool function
        const pool = await getPool();

        // Check if email is already taken
        const username = await usernameGenerate(email);  // Ensure username is generated first
        const query = USER_QUERY.findUserInfoByEmailQuery();

        try {
            const [result] = await pool.promise().query(query, [email]);
            let user = result[0];

            if (user) {
                res.status(409).send({ error: "Email already exists, Please register with a different email id or reset your password" });
            } else {
                // Check if all fields are provided
                if (email && password && passwordConfirmation && termAndCondition) {

                    let passwordDecryption = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    let encryptedPasswordDecryption = CryptoJS.AES.decrypt(passwordConfirmation, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

                    // Hash password
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(passwordDecryption, salt);

                    // Check if password and password confirmation match
                    if (passwordDecryption === encryptedPasswordDecryption && passwordDecryption && encryptedPasswordDecryption) {

                        try {
                            // User registration object
                            const newUser = {
                                email: email,
                                password: hashedPassword,
                                termAndCondition: termAndCondition ? 1 : 0,
                                role: "admin",
                                username: username,  // Ensure username is part of the new user object
                                createdDate: format('yyyy-MM-dd hh:mm:ss', new Date()),
                                deleteFlag: "N"
                            };

                            // Save the user in the database
                            const saveQuery = COMMON_QUERY.saveDataQuery("users", newUser);

                            const [insertResult] = await pool.promise().query(saveQuery);

                            if (insertResult.affectedRows === 1) {
                                res.status(201).send({ message: "Registration successfully done" });
                            } else {
                                res.status(500).send({ error: "Data insertion failed" });
                            }
                        } catch (error) {
                            console.log(error);
                            res.status(500).send({ error: "Unable to Register" });
                        }
                    } else {
                        res.status(400).send({ error: "Password and Confirm Password don't match" });
                    }
                } else {
                    res.status(400).send({ error: "All fields are required" });
                }
            }
        } catch (error) {
            console.log("Error during admin registration: ", error);
            res.status(500).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    userDetailById: async (req, res, next) => {
        let { userId } = req.params;
        // Validate `userId`
        const user_Id = parseInt(userId, 10);
        if (isNaN(user_Id) || user_Id < 0) {
            res.status(400).send({ error: "Please enter valid positive integers for userId" });
            return;
        }
        try {
            const pool = await getPool();
            let query = USER_QUERY.findUserInfoByUserIdQuery();
            const [result] = await pool.promise().query(query, [userId]);
            let user = result[0];

            if (user) {
                res.status(200).send(user)
            } else {
                res.status(400).send({ error: "Invalid userId validate" });
            }
        } catch (error) {
            console.log("error during fetch user Info : ", error);
            res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------
    captcha: function (req, res) {
        try {
            var captcha = svgCaptcha.create({ ignoreChars: 'lI0Oo' });
            // req.session.captcha = captcha.text;
            res.status(200).send(captcha);
            // var captcha = svgCaptcha.create({ ignoreChars: 'lI' });
            // captcha.text = CryptoJS.AES.encrypt(JSON.stringify(captcha.text), 'svgcaptcha_key').toString();
            // res.json(captcha);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    },
    // ^----------------------------------------------------------------------------------------------------------------

}

module.exports = userService;