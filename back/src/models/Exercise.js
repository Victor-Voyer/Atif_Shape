"use strict";

export default (sequelize, DataTypes) => {
  const Exercise = sequelize.define(
    "Exercise",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("Musculation", "Renforcement", "Cardio", "Mobilité"),
        allowNull: false,
      },
      focus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      equipment: {
        type: DataTypes.ENUM("none", "home", "gym"),
        allowNull: false,
      },
      default_sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      default_reps: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Exercise",
      tableName: "exercises",
      underscored: true,
      timestamps: false,
    }
  );

  Exercise.associate = (models) => {
    Exercise.hasMany(models.ProgramSessionExercise, {
      foreignKey: "exercise_id",
      as: "program_session_exercises",
    });
  };

  return Exercise;
};
