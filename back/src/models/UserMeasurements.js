'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserMeasurements = sequelize.define('UserMeasurements', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
    }, {
        sequelize,
        modelName: "UserMeasurements",
        tableName: "user_measurements",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true,
    });
    UserMeasurements.associate = (models) => {
        UserMeasurements.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    };
    return UserMeasurements;
};