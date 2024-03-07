import Users from "../models/usermodel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const users = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!users[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) return res.sendStatus(403);
            const userId = users[0].id;
            const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            res.json({ accessToken })
        });
    } catch (error) {
        console.log(error)
    }
}