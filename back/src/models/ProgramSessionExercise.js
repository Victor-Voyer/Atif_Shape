"use strict";

export default (sequelize, DataTypes) => {
  const ProgramSessionExercise = sequelize.define(
    "ProgramSessionExercise",
    {
      program_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name_snapshot: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reps: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProgramSessionExercise",
      tableName: "program_session_exercises",
      underscored: true,
      timestamps: false,
    }
  );

  ProgramSessionExercise.associate = (models) => {
    ProgramSessionExercise.belongsTo(models.ProgramSession, {
      foreignKey: "program_session_id",
      as: "session",
      onDelete: "CASCADE",
    });
    ProgramSessionExercise.belongsTo(models.Exercise, {
      foreignKey: "exercise_id",
      as: "exercise",
    });
  };

  return ProgramSessionExercise;
};
