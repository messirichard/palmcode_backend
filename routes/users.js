const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.post('/submission-step-1', jwtUserMiddleware, submissionStep1);
// router.patch('/submission-step-2', jwtUserMiddleware, submissionStep2);
// router.patch('/submission-step-3', jwtUserMiddleware, submissionStep3);

module.exports = router;
