const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../../configs');

fs.mkdirSync(config.upload.dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.upload.dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024, files: config.upload.maxFiles },
});

const toDTO = (f) => ({
  filename: f.filename,
  originalName: f.originalname,
  mimetype: f.mimetype,
  size: f.size,
  url: `/uploads/${f.filename}`,
});

module.exports = {
  /** Middleware: one file in form-data field `field` -> req.file */
  single: (field = 'file') => uploader.single(field),
  /** Middleware: many files in form-data field `field` -> req.files */
  multiple: (field = 'files', max = config.upload.maxFiles) => uploader.array(field, max),
  toDTO,
};
