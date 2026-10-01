const { user: userService } = require('../../services');

const canAccess = (req) => req.user.role === 'admin' || String(req.user.id) === String(req.params.id);

module.exports = {
  async me(req, res, next) {
    try {
      res.json({ success: true, data: await userService.findById(req.user.id) });
    } catch (err) { next(err); }
  },

  async list(req, res, next) {
    try {
      res.json({ success: true, data: await userService.findAll() });
    } catch (err) { next(err); }
  },

  async get(req, res, next) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      if (!canAccess(req)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const data = await userService.update(req.params.id, req.body || {}, { isAdmin: req.user.role === 'admin' });
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async remove(req, res, next) {
    try {
      await userService.remove(req.params.id);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) { next(err); }
  },
};