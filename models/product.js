'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.hasMany(models.MaterialByProdNums, {onDelete: 'cascade', hooks:true})
    }
  };
  Product.init({
    product_name: DataTypes.STRING,
    labor: DataTypes.INTEGER,
    wholesale: DataTypes.FLOAT,
    retail_price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    quantity_painted_tree: DataTypes.INTEGER,
    product_num: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};