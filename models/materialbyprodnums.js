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
    // const MaterialByProdNums = sequelize.define('MaterialByProdNums', {
    // product_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Product',
    //     key: 'id'
    //   }
    // },
    // material_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Material',
    //     key: 'id'
    //   }
    // }
    static associate(models) {
      // define association here
      // const MaterialByProdNums = sequelize.define('MaterialByProdNums', {
      //     id: {
      //     type: DataTypes.INTEGER,
      //     primaryKey: true,
      //     autoIncrement: true,
      //     allowNull: false
      // },
      // product_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Product',
      //     key: 'id'
      //   }
      // },
      // material_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Material',
      //     key: 'id'
      //   }
      // }
      // });
      // Product.belongsToMany(Material, { through: MaterialByProdNums });
      // Material.belongsToMany(Product, { through: MaterialByProdNums });
      // MaterialByProdNums.belongsTo(Product);
      // MaterialByProdNums.belongsTo(Material);
      // Product.hasMany(MaterialByProdNums);
      // Material.hasMany(MaterialByProdNums);
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