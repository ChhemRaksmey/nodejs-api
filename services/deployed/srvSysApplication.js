const { Op } = require('sequelize');
const db = require('../../models');

const mdSysApplication = db.mdSysApplication;
const mdSysApplications = db.mdSysApplications;
const httpError = (status, message) => Object.assign(new Error(message), { status });

const FIELDS = ['id_module', 'id_application', 'full_name'];
const UPPER_FIELDS = ['id_module', 'id_application', 'full_name'];
const pick = (obj, fields = FIELDS) => Object.fromEntries(
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
            { id_application: { [Op.eq]: search } },
            { full_name: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {}
    ;

    const { rows, count } = await mdSysApplication.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['full_name', 'ASC']],
    });

    return { rows, meta: { page, limit, total: count, pages: Math.ceil(count / limit) } };
  },

  async findById(id) {
    const record = await mdSysApplication.findByPk(String(id).toUpperCase());
    if (!record) throw httpError(404, 'Record not found');
    return record;
  },

  async create (data) {
    
    const record = await mdSysApplication.create(pick(data));

    if (record) {
      if (data.permissions && data.permissions.length > 0) {

        await mdSysApplications.destroy({ where: { id_application: record.id_application }});

        (data.permissions ?? []).map(async (item) => {
          const new_record = { id_application: record.id_application, id_permission: item };
          await mdSysApplications.create(new_record);
        });

      }
    }

    return record;

  },

  async update(id, data) {

    const record = await module.exports.findById(id);
    
    if (record) {
      
      const updatedData = await record.update(pick(data, ['id_application', 'full_name', 'status']));

      if (data.permissions && data.permissions.length > 0) {

        await mdSysApplications.destroy({ where: { id_application: record.id_application }});

        (data.permissions ?? []).map(async (item) => {
          const new_record = { id_application: record.id_application, id_permission: item };
          await mdSysApplications.create(new_record);
        });

      }

      return updatedData;
    }

    return { error: 'Record not found' };
  },

  async remove(id) {
    const record = await module.exports.findById(id);
    await record.destroy();
    await mdSysApplications.destroy({where: { id_application: updatedData.id_application, }});
  },

};