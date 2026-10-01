const { Op } = require('sequelize');
const db = require('../../models');

const mdCbcCountries = db.mdCbcCountries;
const httpError = (status, message) => Object.assign(new Error(message), { status });

const FIELDS = ['id_country2', 'id_country3', 'full_name'];
const CODE_FIELDS = ['id_country2', 'id_country3'];

const pick = (obj, fields = FIELDS) =>
  Object.fromEntries(
    fields
      .filter((k) => obj[k] !== undefined)
      .map((k) => [k, CODE_FIELDS.includes(k) && obj[k] != null ? String(obj[k]).trim().toUpperCase() : obj[k]])
  )
;

module.exports = {
  
  async findAll({ page = 1, limit = 20, search } = {}) {
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const where = search
      ? {
          [Op.or]: [
            { id_country2: { [Op.iLike]: `%${search}%` } },
            { id_country3: { [Op.iLike]: `%${search}%` } },
            { full_name: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows, count } = await mdCbcCountries.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id_country2', 'ASC']],
    });
    return { rows, meta: { page, limit, total: count, pages: Math.ceil(count / limit) } };
  },

  async findById(id) {
    const record = await mdCbcCountries.findByPk(String(id).toUpperCase());
    if (!record) throw httpError(404, 'Country not found');
    return record;
  },

  create: (data) => mdCbcCountries.create(pick(data)),

  async update(id, data) {
    const record = await module.exports.findById(id);
    return record.update(pick(data, ['id_country3', 'full_name']));
  },

  async remove(id) {
    const record = await module.exports.findById(id);
    await record.destroy();
  },

};