"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("program_sessions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_program_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      day: { type: Sequelize.STRING, allowNull: false },
      day_order: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      focus: { type: Sequelize.STRING, allowNull: false },
      duration_minutes: { type: Sequelize.INTEGER, allowNull: false },
      intensity: {
        type: Sequelize.ENUM("Faible", "Modérée", "Élevée"),
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("program_sessions", {
      fields: ["user_program_id"],
      type: "foreign key",
      name: "program_sessions_user_program_id_fkey",
      references: { table: "user_programs", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("program_sessions");
  },
};
