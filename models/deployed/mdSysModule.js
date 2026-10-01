module.exports = (sequelize, DataTypes) => {
  const mdSysModule = sequelize.define(
    'mdSysModule',
    {
      id_module:    { type: DataTypes.STRING(25), allowNull: false, unique: true, validate: { notEmpty: true }, primaryKey: true },
      full_name:    { type: DataTypes.STRING(250), allowNull: true },
      status:       { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_number: { type: DataTypes.INTEGER, defaultValue: 1 },
      audit_status: { type: DataTypes.STRING(250), defaultValue: "" },
      audit:        { type: DataTypes.JSON, defaultValue: "{}" },
    },
    { schema: 'sch_backend', tableName: 'modules', timestamps: false }
  );

  return mdSysModule;
};