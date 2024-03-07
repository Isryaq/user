import Users from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authSchema, loginSchema, passwordSchema } from "../validation/validator.js";

const getUsers = async(req, res) => {
    try {
        const users = await Users.findOne({
            where:{
                id: req.userId
            },
            attributes: ['id', 'email', 'name']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

const register = async(req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        // Email Validation
        const emailUser = await Users.findOne({
            where:{
                email: result.email
            }
        });
        if(emailUser){
            return res.status(409).json({
                status: false,
                message: 'Email already registered'
            });
        }else{
            const hashPassword = await bcrypt.hash(result.password, 10)
            result.password = hashPassword
            const user = new Users(result)
            const savedUser = await user.save()

            return res.status(200).json({
                status: true,
                message: 'Register User'
            });
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

const login = async(req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const users = await Users.findAll({
            where:{
                email: result.email
            }
        });
        if(!users){
            return res.status(404).json({
                status: false,
                message: 'Email Not Register'
            })
        }

        const isValid = await bcrypt.compare(result.password, users[0].password);
        if(!isValid){
            return res.status(404).json({
                status: false,
                message: 'Password not Valid'
            })
        }

        const userId = users[0].id;
            const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            await Users.update({
                refresh_token: refreshToken
            },{
                where:{
                    id: userId
                }
            });
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({ accessToken })
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

const updatename = async(req, res) =>{
    try {
        const { name } = req.body;
        const users = await Users.findAll({
            id: req.userId
        });
        const userId = users[0].id;
        await Users.update({
            name: name
        },{
            where:{
                id: userId
            }
        });
        res.json({msg: "Update User"})
    } catch (error) {
        console.log(error)
    }
}

const updatepassword = async(req, res, next) =>{
    try {
        const result = await passwordSchema.validateAsync(req.body)
        const { password, newpassword, confPassword } = req.body;
        const users = await Users.findAll({
            id: req.userId
        });

        const isValid = await bcrypt.compare(password, users[0].password);
        if(!isValid){
            return res.status(404).json({
                status: false,
                message: 'Password not Valid'
            })
        }

        if(result.newpassword !== confPassword){
            return res.status(400).json({
                status: false,
                message: "newpassword dan confirmpassword not match"
            })
        }

        if(result.newpassword === password) {
            return  res.status(400).json({
                status: false,
                message: 'the new password and the old password are the same'
            })
        }
        const hashPassword = await bcrypt.hash(result.newpassword, 10)
        const userId = users[0].id;
        await Users.update({
            password: hashPassword
        },{
            where:{
                id: userId
            }
        });
        res.json({msg: "Update Password"})
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

const logout = async(req, res) =>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const users = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!users[0]) return res.sendStatus(204);
    const userId = users[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export default {
    getUsers,
    register,
    login,
    updatename,
    updatepassword,
    logout
}