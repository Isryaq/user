import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './config/database.js';
import router from './routes/server.js';
// import Users from './models/usermodel.js';
dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected....');
    // await Users.sync();
} catch (error) {
    console.log(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, ()=> console.log('server running at port 5000'));