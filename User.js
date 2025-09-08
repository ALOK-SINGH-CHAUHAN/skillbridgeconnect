const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// This will be initialized in server.js with sequelize instance
let sequelize;

const User = (sequelizeInstance) => {
    sequelize = sequelizeInstance;
    
    const UserModel = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            },
            set(value) {
                this.setDataValue('username', value ? value.trim() : value);
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            },
            set(value) {
                this.setDataValue('email', value ? value.trim().toLowerCase() : value);
            }
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher'),
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            set(value) {
                this.setDataValue('full_name', value ? value.trim() : value);
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: false,
        hooks: {
            beforeValidate: (user) => {
                if (user.username) user.username = user.username.trim();
                if (user.email) user.email = user.email.trim().toLowerCase();
                if (user.full_name) user.full_name = user.full_name.trim();
            }
        }
    });

    // Instance method to set password
    UserModel.prototype.setPassword = function(password) {
        this.password_hash = bcrypt.hashSync(password, 10);
    };

    // Instance method to check password
    UserModel.prototype.checkPassword = function(password) {
        return bcrypt.compareSync(password, this.password_hash);
    };

    // Transform output to match frontend expectations
    UserModel.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        return {
            id: values.id,
            username: values.username,
            email: values.email,
            role: values.role,
            full_name: values.full_name,
            created_at: values.created_at
        };
    };

    return UserModel;
};

module.exports = User;