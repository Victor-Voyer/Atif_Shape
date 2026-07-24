"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("program_session_completions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      program_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      week_start_date: { type: Sequelize.DATEONLY, allowNull: false },
      completed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addIndex("program_session_completions", ["program_session_id", "week_start_date"], {
      name: "program_session_completions_session_week_idx",
      unique: true,
    });

    await queryInterface.addConstraint("program_session_completions", {
      fields: ["program_session_id"],
      type: "foreign key",
      name: "program_session_completions_program_session_id_fkey",
      references: { table: "program_sessions", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("program_session_completions");
  },
};
