'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role_id');
  }
};
