require('dotenv').config();
var util = require('util');
var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");

// Database
const DBS = require('./db');

// Middleware
router.use(bodyParser.urlencoded({extended: true}));
router.use(require('method-override')('_method'));

//API Calls
var axios = require('axios');

// Define the home page route
router.get('/', (req, res) => {
  res.send('home page');
});

var redisdb = new DBS();
redisdb.testOutput();

module.exports = router;
