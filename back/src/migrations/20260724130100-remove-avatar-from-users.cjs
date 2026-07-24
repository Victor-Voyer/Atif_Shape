"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("users", "avatar");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
