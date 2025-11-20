"use strict";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 255],
        },
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isValidAge(value) {
            const birthdate = new Date(value);
            const today = new Date();

            const minAge = new Date(today);
            minAge.setFullYear(today.getFullYear() - 5);

            const maxAge = new Date(today);
            maxAge.setFullYear(today.getFullYear() - 150);

            if (birthdate > minAge) {
              throw new Error("User must be at least 5 years old");
            }

            if (birthdate < maxAge) {
              throw new Error("Age cannot be more than 150 years");
            }
          },
        },
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 100,
          max: 300,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 300],
        },
      },      
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  User.associate = (models) => {
    User.hasMany(models.UserWeight, {
      foreignKey: "user_id",
      as: "user_weights",
      onDelete: "CASCADE",
    });
  };
  return User;
};
