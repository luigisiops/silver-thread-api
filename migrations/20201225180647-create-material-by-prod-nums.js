'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MaterialByProdNums', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER, references: {model: 'Products', field: 'id'}
      },
      material_id: {
        type: Sequelize.INTEGER, references: {model: 'Materials', field: 'id'}
      },
      material_name: {
        type: Sequelize.STRING
      },
      material_unit_amount: {
        type: Sequelize.INTEGER
      },
      material_cost: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MaterialByProdNums');
  }
};