const router = require('express').Router();
const { user } = require('../../controllers');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');

const BASE = '/user';

router.use(authenticate);

router.get(`${BASE}/me`,     user.me);
router.get(BASE,             user.list);
router.get(`${BASE}/:id`,    user.get);
router.put(`${BASE}/:id`,    user.update);
router.delete(`${BASE}/:id`, authorize('admin'), user.remove);

module.exports = router;