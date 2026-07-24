"use strict";

export default (sequelize, DataTypes) => {
  const ProgramSessionCompletion = sequelize.define(
    "ProgramSessionCompletion",
    {
      program_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      week_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ProgramSessionCompletion",
      tableName: "program_session_completions",
      underscored: true,
      timestamps: false,
    }
  );

  ProgramSessionCompletion.associate = (models) => {
    ProgramSessionCompletion.belongsTo(models.ProgramSession, {
      foreignKey: "program_session_id",
      as: "session",
      onDelete: "CASCADE",
    });
  };

  return ProgramSessionCompletion;
};
