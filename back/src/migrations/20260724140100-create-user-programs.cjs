"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_programs", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      direction: {
        type: Sequelize.ENUM("lose", "gain", "maintain"),
        allowNull: false,
      },
      equipment: {
        type: Sequelize.ENUM("none", "home", "gym"),
        allowNull: false,
      },
      level: {
        type: Sequelize.ENUM("beginner", "intermediate", "advanced"),
        allowNull: false,
      },
      sessions_per_week: { type: Sequelize.INTEGER, allowNull: false },
      focus_summary: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await queryInterface.addConstraint("user_programs", {
      fields: ["user_id"],
      type: "foreign key",
      name: "user_programs_user_id_fkey",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("user_programs");
  },
};
