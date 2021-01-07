'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialByProdNums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MaterialByProdNums.belongsTo(models.Product)
      models.MaterialByProdNums.belongsTo(models.Material)
    }
  };
  MaterialByProdNums.init({
    product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    material_name: DataTypes.STRING,
    material_unit_amount: DataTypes.INTEGER,
    material_cost: DataTypes.FLOAT,
    ProductId: DataTypes.INTEGER,
    MaterialId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MaterialByProdNums',
  });
  return MaterialByProdNums;
};