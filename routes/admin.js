const express = require('express');
const {loginAdmin} = require("../controller/admin/auth");
const {jwtAdminMiddleware} = require("../middleware/authMiddleware");
const {getCountry, getCountryById} = require("../controller/admin/country/getCountry");
const {updateCountry} = require("../controller/admin/country/updateCountry");
const {createCountry} = require("../controller/admin/country/createCountry");
const {deleteCountry} = require("../controller/admin/country/deleteCountry");
const {getVariant, getVariantById} = require("../controller/admin/variant/getVariant");
const {createVariant} = require("../controller/admin/variant/createVariant");
const {updateVariant} = require("../controller/admin/variant/updateVariant");
const {deleteVariant} = require("../controller/admin/variant/deleteVariant");
const {getSubmission, getSubmissionById, deleteSubmission} = require("../controller/admin/submission/submission");
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
router.get('/get-variant', jwtAdminMiddleware, getVariant);
router.get('/get-variant/:id', jwtAdminMiddleware, getVariantById);
router.post('/create-variant', jwtAdminMiddleware, createVariant);
router.patch('/update-variant/:id', jwtAdminMiddleware,updateVariant);
router.delete('/delete-variant/:id', jwtAdminMiddleware, deleteVariant);
//
// //Get Submission
router.get('/get-submission', jwtAdminMiddleware, getSubmission);
router.get('/get-submission/:id', jwtAdminMiddleware, getSubmissionById);
router.delete('/delete-submission/:id', jwtAdminMiddleware, deleteSubmission);

module.exports = router;
