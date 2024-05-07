const express = require('express');
const {loginAdmin} = require("../controller/admin/auth");
const router = express.Router();

/* GET Admin listing. */
router.post('/login', loginAdmin);
//
// //CRUD Country
// router.get('/country', jwtAdminMiddleware, getCountry);
// router.post('/country', jwtAdminMiddleware, createCountry);
// router.patch('/country', jwtAdminMiddleware,updateCountry);
// router.delete('/country', jwtAdminMiddleware, deleteCountry);
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
