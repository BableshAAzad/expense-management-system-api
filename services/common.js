let USER_QUERY = require("../queries/userQuery.js");
const sql = require('mysql2');
const { dbConfig } = require('../config/dbConfig.js');  // assuming your DB config is in config.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

// Directory for file storage
let EMS_FOLDER = 'ems'
let UPLOAD_TEMP = './uploads_temp';
let UPLOADS = './uploads';
const validFolderNamesForImage = ["user",];
const validFolderNamesForPdf = ["terms_and_conditions",];

// 3 hoursX60 minutes/hourX60 seconds/minute=10,800 seconds
// Create a cache instance with a default TTL of 15 minutes (900 seconds)
const cache_picture_detail = new NodeCache({ stdTTL: 3600 }); //~ 3600 = 1 hours
const cache_pdf_detail = new NodeCache({ stdTTL: 3600 }); //~ 3600 = 1 hours

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


//~ Function to format current date and time
const formatDateAndTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Always 3 digits
    return `d_${year}_${month}_${date}_t_${hours}_${minutes}_${seconds}_${milliseconds}`;
};

// & generate random ID
const generateRandomId = () => {
    return Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Ensure directory exists
let ensureUploadTempDir = (subPath = '') => {

    if (!fs.existsSync(UPLOAD_TEMP)) {
        fs.mkdirSync(UPLOAD_TEMP, { recursive: true });
    }

    if (subPath && !fs.existsSync(subPath)) {
        fs.mkdirSync(subPath, { recursive: true });
    }
}

// Ensure directory exists
let ensureUploadDir = (baseFolder = UPLOADS, subFolder) => {  //~ ensureUploadDir(UPLOADS, "gallery");
    const currentDate = new Date();
    const year = (currentDate.getFullYear()).toString();
    const month = (currentDate.getMonth() + 1).toString(); // Month as a number (1-12)

    // Ensure the base folder exists
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
    }

    // Create the subfolder path inside the base folder
    const subFolderPath = path.join(baseFolder, EMS_FOLDER, subFolder);
    if (!fs.existsSync(subFolderPath)) {
        fs.mkdirSync(subFolderPath, { recursive: true });
    }

    // Create the year folder inside the subfolder
    const yearPath = path.join(subFolderPath, year);
    if (!fs.existsSync(yearPath)) {
        fs.mkdirSync(yearPath, { recursive: true });
    }

    // Create the month folder inside the year folder
    const monthPath = path.join(yearPath, month);
    if (!fs.existsSync(monthPath)) {
        fs.mkdirSync(monthPath, { recursive: true });
    }
    // Return the full path of the dynamically created directory
    return monthPath;
};

//~ Set up storage configuration for multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Dynamically get GALLERY_FOLDER from the request
        const folderName = req.params.folderName || req.query.folderName || 'default_folder';
        const uploadPath = path.join(UPLOAD_TEMP, folderName);
        req.params.uploadPath = uploadPath

        //* Ensure the directory exists
        ensureUploadTempDir(uploadPath);
        cb(null, path.join(uploadPath));
    },
    filename: function (req, file, cb) {
        // Specify the filename format
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const extractFileType = (filename) => {
    return path.extname(filename).toLowerCase();
}
//? Function to extract the filename for subtitle
const extractFilenameOnly = (url, fileType) => {
    const start = url.indexOf('-') + 1; // Find the first '-' and start after it
    const end = url.indexOf(fileType); // Find the extension and end before it
    return url.substring(start, end); // Extract the portion of the string
};

//! File filter for validating file type
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    // const ext = path.extname(file.originalname).toLowerCase();
    const ext = extractFileType(file.originalname)

    if (allowedTypes.includes(ext)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!')); // Reject file
    }
};

const pdfFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf'];
    // const ext = path.extname(file.originalname).toLowerCase();
    const ext = extractFileType(file.originalname)

    if (allowedTypes.includes(ext)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only .pdf formats are allowed!')); // Reject file
    }
};

//& Set up multer with the storage configuration
let imageValidate = multer({
    storage: storage,
    limits: { fileSize: 300 * 1024 }, //~ max file size to 300 kb 
    fileFilter: imageFilter
});

let pdfValidate = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //~ max file size to 10 MB
    fileFilter: pdfFilter
});

// !--------------------------------------------------------------------------------------------------------------------
//~ Function to recursively get all files in a directory
let getAllFilesRecursively = (dir) => {
    let results = [];
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            // Recurse into subdirectory
            results = results.concat(getAllFilesRecursively(fullPath));
        } else {
            // Add file to results
            results.push(fullPath);
        }
    });
    return results;
};

//& Function to get all keys and their corresponding values from the cache
let getAllCacheData = () => {
    const keys = cache_picture_detail.keys(); // Get all keys in the cache
    let allData = [];

    keys.forEach((key) => {
        const value = cache_picture_detail.get(key); // Get the cached value by key
        allData.push({ [key]: value });
    });
    return allData;
};

//! Function to delete files not in the cache
let deleteFiles = () => {
    ensureUploadTempDir(UPLOAD_TEMP);
    try {
        // Get all cached files
        const cacheData = getAllCacheData();
        const cachedFiles = new Set(
            cacheData.flatMap(obj => {
                return Object.values(obj).map(value => {
                    if (value) {
                        return value.split('/').pop(); // Extract filename
                    }
                    return null;
                }).filter(Boolean); // Remove null values
            })
        );

        // Get all files recursively in the upload_temp directory
        const allFiles = getAllFilesRecursively(UPLOAD_TEMP);

        allFiles.forEach((file) => {
            const fileName = path.basename(file);

            // Delete file if not in cache
            if (!cachedFiles.has(fileName)) {
                try {
                    fs.unlinkSync(file); // Synchronous delete
                    // console.log(`Deleted file: ${file}`);
                } catch (err) {
                    console.error(`Error deleting file ${file}:`, err);
                }
            } else {
                // console.log(`Skipping cached file: ${fileName}`);
            }
        });
    } catch (err) {
        console.error('Error during file cleanup:', err);
    }
};

//^ Start the cleaning process every 3 hours
let startCleaning = () => {
    // console.log('File cleaning process started...');
    deleteFiles(); // Initial cleanup

    // Schedule periodic cleanup
    setInterval(() => {
        // console.log('Running periodic delete files task...');
        deleteFiles();
    }, 15 * 60 * 1000); //~ 1 hours in milliseconds = 1 * 60 * 60 * 1000 , 15 minutes = 15 * 60 * 1000
    //~ 3 minutes in milliseconds = 3 * 60 * 1000
};

//! Self-invoke the cleaning process
startCleaning();
// !--------------------------------------------------------------------------------------------------------------------
// * move file temp to actual storage
const moveFile = async (file, title = "file", primaryKey, folderName, sourceDir, fileType) => {
    try {
        let detail_url;
        if (validFolderNamesForImage.includes(folderName) && fileType === "image") {
            detail_url = cache_picture_detail.take(`${file.id}`); // ~ Gets the cached value for a given key and then deletes it.
        } else if (validFolderNamesForPdf.includes(folderName) && fileType === "pdf") {
            detail_url = cache_pdf_detail.take(`${file.id}`);
        } else {
            return null;
        }

        if (detail_url) {
            let monthPath = ensureUploadDir(UPLOADS, folderName);//? check if folder not exist then create folder

            let convertedMonthName = monthPath.toString().replace(/\\/g, '/'); //? Converts "uploads\gallery\2024\12" to "uploads/gallery/2024/12"
            let getFileName = detail_url.split("/").pop()  //? "./uploads_temp/gallery/d_2025_01_01_t_11_11_04_776_1735710064776_634503.jpg" to "d_2025_01_01_t_11_11_04_776_1735710064776_634503.jpg"

            const newFilename = `${title}_${primaryKey}_${getFileName}`; // Add newsNotificationMainId and userId to the filename
            const sourcePath = path.join(sourceDir, detail_url); // Construct source path
            const targetPath = path.join(monthPath, newFilename); // Construct target path

            // Ensure both directories exist
            if (!fs.existsSync(sourceDir)) {
                fs.mkdirSync(sourceDir, { recursive: true });
            }

            await fs.promises.rename(sourcePath, targetPath);
            return `/${convertedMonthName}/${newFilename}`;
        }
        return null;
    } catch (err) {
        console.error('Error occurred during moving file : ', err);
        throw new Error('Failed to move file');
    }
};

const syncMoveFile = (file, title = "file", primaryKey, folderName, sourceDir, fileType) => {
    try {
        let detail_url;
        if (validFolderNamesForImage.includes(folderName) && fileType === "image") {
            detail_url = cache_picture_detail.take(`${file.id}`); // ~ Gets the cached value for a given key and then deletes it.
        } else if (validFolderNamesForPdf.includes(folderName) && fileType === "pdf") {
            detail_url = cache_pdf_detail.take(`${file.id}`);
        } else {
            return null;
        }

        if (detail_url) {
            let monthPath = ensureUploadDir(UPLOADS, folderName); // Check if folder not exist then create folder

            let convertedMonthName = monthPath.toString().replace(/\\/g, '/'); // Converts "uploads\gallery\2024\12" to "uploads/gallery/2024/12"
            let getFileName = detail_url.split("/").pop(); // Extract file name

            const newFilename = `${title}_${primaryKey}_${getFileName}`; // Add newsNotificationMainId and userId to the filename
            const sourcePath = path.join(sourceDir, detail_url); // Construct source path
            const targetPath = path.join(monthPath, newFilename); // Construct target path

            // Ensure both directories exist
            if (!fs.existsSync(sourceDir)) {
                fs.mkdirSync(sourceDir, { recursive: true });
            }

            // Rename the file (asynchronous but waits synchronously here)
            fs.promises.rename(sourcePath, targetPath).catch(err => {
                console.error('Error occurred during moving file:', err);
                throw new Error('Failed to move file');
            });
            return `/${convertedMonthName}/${newFilename}`;
        } else {
            console.log("Error: file not found in cache");
        }
        return null;
    } catch (error) {
        // Log the error and return a fallback response
        console.error('Error occurred during moving file:', error);
        return { error: 'Failed to move file', details: error.message };
    }
};

let getPaginationResponse = (page, size, totalElements, data) => {
    let number = page === 0 ? 0 : page - 1 // ^ for handle zero index
    return {
        number,
        size,
        totalPages: Math.ceil(totalElements / size),
        totalElements,
        data
    }
}

// Helper function to format the date
let formatDate = (date) => {
    try {
        if (!date) return null; // Handle null or undefined dates
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            throw new Error("Invalid date format"); // Catch invalid date inputs
        }
        const day = d.getDate().toString().padStart(2, '0'); // Ensures two-digit day
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    } catch (err) {
        console.error("Error formatting date:", err.message);
        return null; // Fallback to null on error
    }
};

let stringToJsonForObject = function (str, errorMessageTitle, callback) {
    if (str && typeof str === "object") {
        return str;
    }
    let fileObject;
    if (str && typeof str === "string") {
        // Trim string to handle any whitespace before parsing
        str = str.trim();

        if (str.startsWith("{") && str.endsWith("}")) {
            try {
                fileObject = JSON.parse(str);

                if (typeof fileObject === 'object' && fileObject !== null && !Array.isArray(fileObject)) {
                    // Successfully parsed a valid object
                    return fileObject;
                } else {
                    // Handle case where parsed JSON is not an object
                    throw new Error(`${errorMessageTitle} is not a valid JSON object.`);
                }
            } catch (error) {
                console.error(`Invalid JSON string for ${errorMessageTitle}: `, error);
                callback(error.message);
                return;
            }
        }
        // else {
        //     // Handle the case where the string is not a valid JSON object
        //     console.error(`Input string is not a valid JSON object for ${errorMessageTitle}.`);
        //     callback(`Input string is not a valid JSON object for ${errorMessageTitle}.`);
        //     return;
        // }
    } else if (!str) {
        return;
    } else {
        // Handle the case where input is not a string
        console.error(`Expected a string for ${errorMessageTitle}, but received: `, str);
        callback(`Expected a string for ${errorMessageTitle}, but received: ${typeof str}`);
        return;
    }
};

let stringToJsonForArray = function (str, errorMessageTitle, callback) {
    if (str && Array.isArray(str)) {
        return str;
    }
    let fileObject;
    if (str && typeof str === "string") {
        // Trim string to handle any whitespace before parsing
        str = str.trim();

        if (str.startsWith("[") && str.endsWith("]")) {
            try {
                fileObject = JSON.parse(str);
                if (Array.isArray(fileObject)) {
                    // Successfully parsed a valid array
                    return fileObject;
                } else {
                    // Handle case where parsed JSON is not an array
                    throw new Error(`${errorMessageTitle} is not a valid JSON array.`);
                }
            } catch (error) {
                console.error(`Invalid JSON string for ${errorMessageTitle}: `, error);
                callback(error.message);
                return;
            }
        }
        //  else {
        //     // Handle the case where the string is not a valid JSON array
        //     console.error(`Input string is not a valid JSON array for ${errorMessageTitle}.`);
        //     callback(`Input string is not a valid JSON array for ${errorMessageTitle}.`);
        //     return;
        // }
    } else if (!str) {
        return;
    } else {
        // Handle the case where input is not a string
        console.error(`Expected a string for ${errorMessageTitle}, but received: `, str);
        callback(`Expected a string for ${errorMessageTitle}, but received: ${typeof str}`);
        return;
    }
};


module.exports = {
    usernameGenerate,
    getPool,
    formatDateAndTime,
    formatDate,
    generateRandomId,
    imageValidate,
    pdfValidate,
    extractFileType,
    extractFilenameOnly,
    cache_picture_detail,
    cache_pdf_detail,
    moveFile,
    syncMoveFile,
    UPLOAD_TEMP,
    UPLOADS,
    getPaginationResponse,
    validFolderNamesForImage,
    validFolderNamesForPdf,
    stringToJsonForObject,
    stringToJsonForArray
}
