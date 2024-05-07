const express = require('express');
const {jwtUserMiddleware} = require("../middleware/authMiddleware");
const {submissionStep1, submissionStep2, submissionStep3} = require("../controller/users/submission");
const router = express.Router();
const upload = require('../middleware/fileMiddleware').single('pdfFile');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/submission-step-1', submissionStep1);
router.patch('/submission-step-2', jwtUserMiddleware, submissionStep2);
router.patch('/submission-step-3', jwtUserMiddleware, upload, submissionStep3);

module.exports = router;
