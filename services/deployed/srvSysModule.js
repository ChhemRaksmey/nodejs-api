const { Op } = require('sequelize');
const db = require('../../models');

const mdSysModule = db.mdSysModule;
const httpError = (status, message) => Object.assign(new Error(message), { status });

const FIELDS = ['id_module', 'full_name', 'status'];
const UPPER_FIELDS = ['id_module', 'full_name'];
const pick = (obj, fields = FIELDS) =>
  Object.fromEntries(
    fields
      .filter((k) => obj[k] !== undefined)
      .map((k) => [k, UPPER_FIELDS.includes(k) && obj[k] != null ? String(obj[k]).trim().toUpperCase() : obj[k]])
  );

module.exports = {
  
  async findAll({ page = 1, limit = 20, search } = {}) {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const where = search
      ? {
          [Op.or]: [
            { id_module: { [Op.eq]: search } },
            { full_name: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows, count } = await mdSysModule.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['full_name', 'ASC']],
    });
    return { rows, meta: { page, limit, total: count, pages: Math.ceil(count / limit) } };
  },

  async findById(id) {
    const record = await mdSysModule.findByPk(String(id).toUpperCase());
    if (!record) throw httpError(404, 'record not found');
    return record;
  },

  create: (data) => mdSysModule.create(pick(data)),

 async update(id, data) {
    const record = await module.exports.findById(id);
    return record.update(pick(data, ['id_module', 'full_name']));
  },

  async remove(id) {
    const record = await module.exports.findById(id);
    await record.destroy();
  },

};