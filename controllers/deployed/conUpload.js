const { srvUpload: srvUpload } = require('../../services');

module.exports = {
  single(req, res) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded (form-data field: "file")' });
    }
    res.status(201).json({ success: true, data: srvUpload.toDTO(req.file) });
  },

  multiple(req, res) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded (form-data field: "files")' });
    }
    res.status(201).json({ success: true, data: req.files.map(srvUpload.toDTO) });
  },
};
