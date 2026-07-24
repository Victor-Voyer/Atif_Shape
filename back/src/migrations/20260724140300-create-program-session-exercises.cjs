"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("program_session_exercises", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      program_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exercise_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      name_snapshot: { type: Sequelize.STRING, allowNull: false },
      sets: { type: Sequelize.INTEGER, allowNull: false },
      reps: { type: Sequelize.STRING, allowNull: true },
      position: { type: Sequelize.INTEGER, allowNull: false },
    });

    await queryInterface.addConstraint("program_session_exercises", {
      fields: ["program_session_id"],
      type: "foreign key",
      name: "program_session_exercises_program_session_id_fkey",
      references: { table: "program_sessions", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("program_session_exercises", {
      fields: ["exercise_id"],
      type: "foreign key",
      name: "program_session_exercises_exercise_id_fkey",
      references: { table: "exercises", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("program_session_exercises");
  },
};
