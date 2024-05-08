const express = require('express');
const {getCountry} = require("../controller/admin/country/getCountry");
const {getVariant} = require("../controller/admin/variant/getVariant");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.get('/country', getCountry);
// router.get('/variant', getVariant);

router.get('/get-country', getCountry);
router.get('/get-variant', getVariant);

module.exports = router;
