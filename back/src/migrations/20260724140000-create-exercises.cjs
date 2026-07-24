"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exercises", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      category: {
        type: Sequelize.ENUM("Musculation", "Renforcement", "Cardio", "Mobilité"),
        allowNull: false,
      },
      focus: { type: Sequelize.STRING, allowNull: false },
      equipment: {
        type: Sequelize.ENUM("none", "home", "gym"),
        allowNull: false,
      },
      default_sets: { type: Sequelize.INTEGER, allowNull: false },
      default_reps: { type: Sequelize.STRING, allowNull: true },
      instructions: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.addIndex("exercises", ["category", "focus", "equipment"], {
      name: "exercises_category_focus_equipment_idx",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("exercises");
  },
};
