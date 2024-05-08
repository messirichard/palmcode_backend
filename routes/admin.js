const express = require('express');
const {loginAdmin} = require("../controller/admin/auth");
const {jwtAdminMiddleware} = require("../middleware/authMiddleware");
const {getCountry, getCountryById} = require("../controller/admin/country/getCountry");
const {updateCountry} = require("../controller/admin/country/updateCountry");
const {createCountry} = require("../controller/admin/country/createCountry");
const {deleteCountry} = require("../controller/admin/country/deleteCountry");
const router = express.Router();

/* GET Admin listing. */
router.post('/login', loginAdmin);
//
// //CRUD Country
router.get('/get-country', jwtAdminMiddleware, getCountry);
router.get('/get-country/:id', jwtAdminMiddleware, getCountryById);
router.post('/create-country', jwtAdminMiddleware, createCountry);
router.patch('/update-country/:id', jwtAdminMiddleware, updateCountry);
router.delete('/delete-country/:id', jwtAdminMiddleware, deleteCountry);
//
// //CRUD Variant
// router.get('/variant', jwtAdminMiddleware, getVariant);
// router.post('/variant', jwtAdminMiddleware, createVariant);
// router.patch('/variant', jwtAdminMiddleware,updateVariant);
// router.delete('/variant', jwtAdminMiddleware, deleteVariant);
//
// //Get Submission
// router.get('/submission', jwtAdminMiddleware, getSubmission);
// router.get('/submission/:id', jwtAdminMiddleware, getSubmissionById);

module.exports = router;
