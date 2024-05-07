const express = require('express');
const router = express.Router();
const actions = require('../api/actions');

router.post('/login', actions.login)
router.get('/pobierzDane', actions.pobierzDane)

module.exports = router;
