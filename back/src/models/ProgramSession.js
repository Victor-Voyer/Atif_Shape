"use strict";

export default (sequelize, DataTypes) => {
  const ProgramSession = sequelize.define(
    "ProgramSession",
    {
      user_program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      day_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      focus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      intensity: {
        type: DataTypes.ENUM("Faible", "Modérée", "Élevée"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProgramSession",
      tableName: "program_sessions",
      underscored: true,
      timestamps: false,
    }
  );

  ProgramSession.associate = (models) => {
    ProgramSession.belongsTo(models.UserProgram, {
      foreignKey: "user_program_id",
      as: "user_program",
      onDelete: "CASCADE",
    });
    ProgramSession.hasMany(models.ProgramSessionExercise, {
      foreignKey: "program_session_id",
      as: "exercises",
      onDelete: "CASCADE",
    });
    ProgramSession.hasMany(models.ProgramSessionCompletion, {
      foreignKey: "program_session_id",
      as: "completions",
      onDelete: "CASCADE",
    });
  };

  return ProgramSession;
};
