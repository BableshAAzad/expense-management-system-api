const { error } = require("console");
let { formatDateAndTime,
    generateRandomId,
    imageValidate,
    pdfValidate,
    extractFileType,
    extractFilenameOnly,
    cache_picture_detail,
    cache_pdf_detail,
    validFolderNamesForImage,
    validFolderNamesForPdf
} = require("./common.js")
const fs = require('fs');
const path = require('path');

let filesProcessService = {
    //^ -----------------------------------------------------------------------------------------------------------------
    //? Image upload handler
    addImageInTempFolder: async (request, response) => {
        let { folderName } = request.query

        if (!validFolderNamesForImage.includes(folderName)) { //^ validate folder name is correct or not
            return response.status(400).send({ error: "Please enter correct folder name" });
        }
        const uploadFile = () =>
            new Promise((resolve, reject) => {
                imageValidate.single('file')(request, null, (err) => { //! validate image file
                    if (err) {
                        reject(new Error(err.message || err));
                    } else {
                        resolve();
                    }
                });
            });

        try {
            // Wait for the file upload to complete
            await uploadFile();

            // Check if the file object exists
            if (!request.file) {
                return response.status(400).send({ error: 'No file uploaded' });
            }

            //~ Validate minimum file size
            const fileStats = fs.statSync(request.file.path);
            if (fileStats.size < 50 * 1024) {
                return response.status(400).send({ error: 'File size must be at least 50 KB' });
            }

            const randomId = generateRandomId();
            const fileType = extractFileType(request.file.originalname);
            // console.log(" request.params : ",  request.params)
            const uploadPath = request.params.uploadPath ? request.params.uploadPath.toString().replace(/\\/g, '/') : "uploads_temp/gallery"

            // Prepend the date and time to the original filename
            const formattedFilename = `${formatDateAndTime()}_${randomId}${fileType}`;

            const uploadedFilePath = path.join(request.file.destination, request.file.filename); // Temp filename
            const newFilePath = path.join(request.file.destination, formattedFilename);
            fs.renameSync(uploadedFilePath, newFilePath); // Rename file with formatted name

            //~ Store URL in cache with separate keys
            cache_picture_detail.set(`${randomId}`, `./${uploadPath}/${formattedFilename}`);

            response.status(201).send({ url: `/${uploadPath}/${formattedFilename}`, id: randomId, Sub_Title: extractFilenameOnly(request.file.filename, fileType) });
        } catch (error) {
            console.log("Error occurred during image File upload in temp : ", error)
            response.status(500).send({ error: error.message || error });
        }
    },
    //^ -----------------------------------------------------------------------------------------------------------------
    addPdfInTempFolder: async (request, response) => {
        let { folderName } = request.query

        if (!validFolderNamesForPdf.includes(folderName)) { //^ validate folder name is correct or not
            return response.status(400).send({ error: "Please enter correct folder name" });
        }
        const uploadFile = () =>
            new Promise((resolve, reject) => {
                pdfValidate.single('file')(request, null, (err) => { //! validate pdf file
                    if (err) {
                        reject(new Error(err.message || err));
                    } else {
                        resolve();
                    }
                });
            });

        try {
            // Wait for the file upload to complete
            await uploadFile();

            // Check if the file object exists
            if (!request.file) {
                return response.status(400).send({ error: 'No file uploaded' });
            }

            //~ Validate minimum file size
            const fileStats = fs.statSync(request.file.path);
            if (fileStats.size < 5 * 1024) {
                return response.status(400).send({ error: 'File size must be at least 5 KB' });
            }

            const randomId = generateRandomId();
            const fileType = extractFileType(request.file.originalname);
            const uploadPath = request.params.uploadPath ? request.params.uploadPath.toString().replace(/\\/g, '/') : "uploads_temp"

            // Prepend the date and time to the original filename
            const formattedFilename = `${formatDateAndTime()}_${randomId}${fileType}`;

            const uploadedFilePath = path.join(request.file.destination, request.file.filename); // Temp filename
            const newFilePath = path.join(request.file.destination, formattedFilename);
            fs.renameSync(uploadedFilePath, newFilePath); // Rename file with formatted name

            //~ Store URL in cache with separate keys
            cache_pdf_detail.set(`${randomId}`, `./${uploadPath}/${formattedFilename}`);
            response.status(201).send({ url: `/${uploadPath}/${formattedFilename}`, id: randomId, Sub_Title: extractFilenameOnly(request.file.filename, fileType) });
        } catch (error) {
            console.log("Error occurred during pdf File upload in temp : ", error)
            response.status(500).send({ error: error.message || error });
        }
    },
    //^ -----------------------------------------------------------------------------------------------------------------

    //^ -----------------------------------------------------------------------------------------------------------------

}

module.exports = filesProcessService