'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialByProdNum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MaterialByProdNum.init({
    product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    material_name: DataTypes.STRING,
    material_unit_amount: DataTypes.INTEGER,
    material_cost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MaterialByProdNum',
  });
  return MaterialByProdNum;
};