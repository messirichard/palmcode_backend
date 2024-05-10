const express = require('express');
const {getCountry} = require("../controller/users/getCountry");
const {getVariant} = require("../controller/users/getVariant");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get-country', getCountry);
router.get('/get-variant', getVariant);

module.exports = router;
