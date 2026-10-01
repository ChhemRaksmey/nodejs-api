const router = require('express').Router();
const { conUpload } = require('../../controllers');
const { srvUpload: srvUpload } = require('../../services');
const { authenticate } = require('../../middlewares/auth.middleware');

const BASE = '/upload';

router.use(authenticate);

router.post(`${BASE}/single`,   srvUpload.single('file'),    conUpload.single);
router.post(`${BASE}/multiple`, srvUpload.multiple('files'), conUpload.multiple);

module.exports = router;
