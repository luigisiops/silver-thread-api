'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Material.hasMany(models.MaterialByProdNums, {onDelete: 'cascade', hooks:true})
      // models.Material.belongsTo(models.Product)
    }
  };
  Material.init({
    material_name: DataTypes.STRING,
    vendor: DataTypes.STRING,
    vendor_material_id: DataTypes.STRING,
    unit: DataTypes.STRING,
    unit_price: DataTypes.FLOAT,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};