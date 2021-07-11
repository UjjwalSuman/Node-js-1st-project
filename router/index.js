const express = require('express');

const router = express.Router();

// to use another router file
router.use('/api/v1/user', require('./user'));

// exports the router
module.exports = router;
