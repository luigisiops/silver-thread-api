'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('MaterialByProdNums', 'ProductId', {
      type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('MaterialByProdNums', 'MaterialId', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('MaterialByProdNums', 'ProductId', {
      type: Sequelize.INTEGER
    }),
    queryInterface.removeColumn('MaterialByProdNums', 'MaterialId', {
      type: Sequelize.INTEGER
    })
  }
};
