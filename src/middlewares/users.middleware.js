import { db } from "../database/database.connection.js"

export async function validateUserHeader(req, res, next) {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    if(!userToken) return res.status(401).send("header invalido")
    try {
        const user = await db.query(`SELECT * FROM sessions WHERE token=$1`, [userToken])
        if(user.rowCount === 0) return res.status(401).send({ message: "token invalido!" })
        const userId = user.rows[0].userId

        
        res.locals.userId = userId;
        return next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}


