module.exports = (sequelize, DataTypes) => {
  const mdSysApplication = sequelize.define(
    'mdSysApplication',
    {
      id_application: { type: DataTypes.STRING(25), allowNull: false, unique: true, validate: { notEmpty: true }, primaryKey: true },
      id_module:      { type: DataTypes.STRING(25), allowNull: false },
      full_name:      { type: DataTypes.STRING(250), allowNull: true },
      status:         { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_number:   { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_status:   { type: DataTypes.STRING(250), defaultValue: "" },
      audit:          { type: DataTypes.JSON, defaultValue: "{}" },
    },
    { schema: 'sch_backend', tableName: 'application', timestamps: false }
  );

  return mdSysApplication;
};

module.exports = (sequelize, DataTypes) => {
  const mdSysApplications = sequelize.define(
    'mdSysApplications',
    {
      id_application: { type: DataTypes.STRING(25), allowNull: false, unique: true, validate: { notEmpty: true }, primaryKey: true },
      id_permission:  { type: DataTypes.STRING(35), allowNull: false, unique: true, validate: { notEmpty: true }, primaryKey: true },
    },
    { schema: 'sch_backend', tableName: 'applications', timestamps: false }
  );

  return mdSysApplications;
};
