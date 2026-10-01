const { user: userService } = require('../../services');

module.exports = {
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body || {});
      res.status(201).json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body || {};
      const data = await userService.authenticate(email, password);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },
};
