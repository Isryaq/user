import { Sequelize } from 'sequelize';
import database from '../config/database.js';

const { DataTypes } = Sequelize;

const Users = database.define('users',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
},{
    freezeTableName: true
});

export default Users;