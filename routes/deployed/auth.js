const router = require('express').Router();
const { auth } = require('../../controllers');

const BASE = '/auth';

router.post(`${BASE}/register`, auth.register);
router.post(`${BASE}/login`,    auth.login);

module.exports = router;
