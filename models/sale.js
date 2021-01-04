'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Sale.init({
    product_id: DataTypes.INTEGER,
    product_number: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_category: DataTypes.STRING,
    price_per_unit: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    total_price: DataTypes.FLOAT,
    sold_to: DataTypes.STRING,
    date_sold: DataTypes.DATEONLY,
    discount: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    shipping: DataTypes.FLOAT,
    quantity_sold_at_painted_tree: DataTypes.INTEGER,
    total_sales: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};