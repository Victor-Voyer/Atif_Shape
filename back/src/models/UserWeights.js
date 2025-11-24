export default (sequelize, DataTypes) => {
  const UserWeight = sequelize.define(
    "UserWeight",
    {
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      measured_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "user_weights",
      underscored: true,
      timestamps: false,
    }
  );

  UserWeight.associate = (models) => {
    UserWeight.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return UserWeight;
};
