const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../configs');
const db = require('../../models');

const User = db.user;
const httpError = (status, message) => Object.assign(new Error(message), { status });

const ALLOWED_SELF_FIELDS = ['name', 'email', 'password'];
const ALLOWED_ADMIN_FIELDS = [...ALLOWED_SELF_FIELDS, 'role', 'isActive'];
const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

module.exports = {
  
  async register({ name, email, password }) {
    
    if (!name || !email || !password) throw httpError(400, 'name, email and password are required');
    if (String(password).length < 8) throw httpError(400, 'password must be at least 8 characters');

    const user = await User.create({ name, email, password });

    return User.findByPk(user.id);
  },

  async authenticate(email, password) {

    if (!email || !password) throw httpError(400, 'email and password are required');
    const user = await User.unscoped().findOne({ where: { email: String(email).trim().toLowerCase() } });

    const ok = user && user.isActive && (await bcrypt.compare(password, user.password));
    if (!ok) throw httpError(401, 'Invalid credentials');
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.jwt.secret, {

      expiresIn: config.jwt.expiresIn,
    });

    return { token, user: await User.findByPk(user.id) };
  },

  findAll: () => User.findAll({ order: [['id', 'ASC']] }),
  findById: (id) => User.findByPk(id),

  async update(id, data, { isAdmin = false } = {}) {

    const user = await User.findByPk(id);
    if (!user) throw httpError(404, 'User not found');

    const fields = pick(data, isAdmin ? ALLOWED_ADMIN_FIELDS : ALLOWED_SELF_FIELDS);
    if (fields.password && String(fields.password).length < 8) {
      throw httpError(400, 'password must be at least 8 characters');
    }

    await user.update(fields);

    return User.findByPk(id);
  },

  async remove(id) {
    const user = await User.findByPk(id);
    if (!user) throw httpError(404, 'User not found');

    await user.destroy();
  },

  /** Create the bootstrap admin from env if it doesn't exist yet. */
  async ensureAdmin() {

    const { email, password } = config.admin;
    if (!email || !password) return null;

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) return existing;

    return User.create({ name: 'Administrator', email, password, role: 'admin' });
  },

};

