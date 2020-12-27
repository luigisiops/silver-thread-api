'use strict';
const {
  Model
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
      const MaterialByProdNums = sequelize.define('MaterialByProdNums', {
          id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      }
      });
      Product.belongsToMany(Material, { through: MaterialByProdNums });
      Material.belongsToMany(Product, { through: MaterialByProdNums });
      MaterialByProdNums.belongsTo(Product);
      MaterialByProdNums.belongsTo(Material);
      Product.hasMany(MaterialByProdNums);
      Material.hasMany(MaterialByProdNums);
    }
  };
  MaterialByProdNums.init({
    product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    material_name: DataTypes.STRING,
    material_unit_amount: DataTypes.INTEGER,
    material_cost: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MaterialByProdNums',
  });
  return MaterialByProdNums;
};