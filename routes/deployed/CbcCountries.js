const router = require('express').Router();
const { conCbcCountries: ctrl } = require('../../controllers');
const { authenticate } = require('../../middlewares/auth.middleware');

const BASE = '/v1.0.1/cbc/countries';

router.get(BASE,             authenticate, ctrl.list);
router.get(`${BASE}/:id`,    authenticate, ctrl.get);
router.post(BASE,            authenticate, ctrl.create);
router.put(`${BASE}/:id`,    authenticate, ctrl.update);
router.delete(`${BASE}/:id`, authenticate, ctrl.remove);

module.exports = router;
