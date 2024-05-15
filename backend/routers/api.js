const express = require('express');
const router = express.Router();
const actions = require('../api/actions');

router.post('/login', actions.login)
router.get('/fetchData', actions.fetchData)
router.post('/edit', actions.edit)

module.exports = router;
