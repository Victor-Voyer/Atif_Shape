"use strict";

export default (sequelize, DataTypes) => {
  const UserProgram = sequelize.define(
    "UserProgram",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      direction: {
        type: DataTypes.ENUM("lose", "gain", "maintain"),
        allowNull: false,
      },
      equipment: {
        type: DataTypes.ENUM("none", "home", "gym"),
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
        allowNull: false,
      },
      sessions_per_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      focus_summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserProgram",
      tableName: "user_programs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UserProgram.associate = (models) => {
    UserProgram.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
    UserProgram.hasMany(models.ProgramSession, {
      foreignKey: "user_program_id",
      as: "sessions",
      onDelete: "CASCADE",
    });
  };

  return UserProgram;
};
