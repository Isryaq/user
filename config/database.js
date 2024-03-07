import { Sequelize } from 'sequelize';

const database = new Sequelize('management_db','root','',{
    host:"localhost",
    dialect: "mysql"
});

export default database;