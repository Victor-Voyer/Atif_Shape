export default (sequelize, DataTypes) => {
  const UserWeight = sequelize.define(
    "UserWeight",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      measured_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
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
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
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
