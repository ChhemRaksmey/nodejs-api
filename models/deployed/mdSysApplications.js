module.exports = (sequelize, DataTypes) => {
  const mdSysApplications = sequelize.define(
    'mdSysApplications',
    {
      id_application: { type: DataTypes.STRING(25), allowNull: false, validate: { notEmpty: true }, primaryKey: true },
      id_permission:  { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true }, primaryKey: true },
      status:         { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_number:   { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_status:   { type: DataTypes.STRING(250), defaultValue: "" },
      audit:          { type: DataTypes.JSON, defaultValue: "{}" },
    },
    { schema: 'sch_backend', tableName: 'applications', timestamps: false }
  );

  return mdSysApplications;
};