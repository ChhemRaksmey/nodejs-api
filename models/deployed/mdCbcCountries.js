module.exports = (sequelize, DataTypes) => {
  const mdCBCCountry = sequelize.define(
    'mdCBCCountry',
    {
      id_country2: { type: DataTypes.STRING(2), allowNull: false, unique: true, validate: { notEmpty: true }, primaryKey: true },
      id_country3: { type: DataTypes.STRING(3), allowNull: false, unique: true, validate: { notEmpty: true } },
      full_name:   { type: DataTypes.STRING(250), allowNull: true },
    },
    { schema: 'sch_cbc', tableName: 'countries', timestamps: false }
  );

  return mdCBCCountry;
};