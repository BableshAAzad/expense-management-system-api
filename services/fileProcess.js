const path = require('path');

let fileProcess = (app) => {
    // ?--------------------------------------------------------------------------------------------
    // app.use('/uploads_temp', express.static(path.join(__dirname, '../uploads_temp')));
    // app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    //? Middleware for serving temp uploaded files
    app.use('/uploads_temp', (req, res, next) => {
        const filePath = path.join(__dirname, '../uploads_temp', req.url);
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).send({ status: 404, error: 'File not found in uploads_temp' });
            }
        });
    });

    //? Middleware for serving database uploaded files
    app.use('/uploads', (req, res, next) => {
        const filePath = path.join(__dirname, '../uploads', req.url);
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(404).send({ status: 404, error: 'File not found in uploads' });
            }
        });
    });
    // ?--------------------------------------------------------------------------------------------
}
module.exports = fileProcess