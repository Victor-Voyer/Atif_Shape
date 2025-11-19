'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 255],
            },
        },
    }, {
        sequelize,
        modelName: "Role",
        tableName: "roles",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        underscored: true,
    });
    Role.associate = (models) => {
        Role.hasMany(models.User, { foreignKey: "role_id", as: "users", onDelete: "CASCADE" });
    };
    return Role;
};