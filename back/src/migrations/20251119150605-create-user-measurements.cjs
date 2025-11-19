'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_measurements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    }, {
      underscored: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_measurements");
  },
};
