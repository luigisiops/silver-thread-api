'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('Sales', 'discount', {
      type: Sequelize.FLOAT
    }),
    queryInterface.addColumn('Sales', 'tax', {
      type: Sequelize.FLOAT
    }),
    queryInterface.addColumn('Sales', 'shipping', {
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
    return queryInterface.removeColumn('Sales', 'discount', {
      type: Sequelize.FLOAT
    }),
    queryInterface.removeColumn('Sales', 'tax', {
      type: Sequelize.FLOAT
    }),
    queryInterface.removeColumn('Sales', 'shipping', {
      type: Sequelize.FLOAT
    })
  }
};
