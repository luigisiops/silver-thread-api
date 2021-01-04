'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('Sales', 'quantity_sold_at_painted_tree', {
      type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('Sales', 'total_sales', {
      type: Sequelize.FLOAT
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('Sales', 'quantity_sold_at_painted_tree', {
      type: Sequelize.INTEGER
    }),
    queryInterface.removeColumn('Sales', 'total_sales', {
      type: Sequelize.FLOAT
    })
  }
};
