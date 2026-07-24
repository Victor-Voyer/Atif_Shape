"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn("users", "age", "birthdate");
  },

  async down(queryInterface) {
    await queryInterface.renameColumn("users", "birthdate", "age");
  },
};
