const express = require('express');
require('dotenv').config();
let userRoutes = require("./routes/userRoutes.js")
let cors = require("cors");
var morgan = require('morgan');
const startupDebugger = require('debug')('app:startup');
// let fileRoutes = require("./routes/fileRoutes.js")
// let fileProcess = require("./services/fileProcess.js")

const app = express();
const APP_PORT = process.env.APP_PORT || '3410';
// const HOST = process.env.HOST || '192.168.1.208'; // Replace with your computer's IP address

const API_URL = process.env.NODE_ENV === `production` 
  ? process.env.HOST 
  : `localhost`;

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    // origin: '*', // Replace '*' with a specific origin for stricter security
    origin: ["http://localhost:4200", "http://192.168.1.208:5173", "http://localhost:5174", "http://localhost:5500"], // List your frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'], // Add any headers you want to expose
}));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));//Not use in production
  //console.log('Morgan Enabled');
  startupDebugger('Morgan Enabled');

}

// * define all routes
app.use("/ems/api", userRoutes);

// fileProcess(app); //& for get files

// Start the Server
app.listen(APP_PORT, API_URL, () => {
    console.log(`Server running on http://${API_URL}:${APP_PORT}`);
});
