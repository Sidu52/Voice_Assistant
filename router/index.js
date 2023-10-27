const express = require('express');
const router = express.Router();

const { findfunction } = require('../controller/home');

router.post('/findfunction', findfunction);

module.exports = router;