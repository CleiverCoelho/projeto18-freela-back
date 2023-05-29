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

export async function validateUserHeaderPost(req, res, next) {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    const {imgUrl, description} = req.body;
    if(!userToken) return res.status(401).send("header invalido")
    try {
        const user = await db.query(`SELECT * FROM sessions WHERE token=$1`, [userToken])
        if(user.rowCount === 0) return res.status(401).send({ message: "token invalido!" })
        const userId = user.rows[0].userId

        
        res.locals.userId = userId;
        res.locals.imgUrl = imgUrl;
        res.locals.description = description
        return next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}

// rota autenticada para identificar quem é a pessoa que está requisitando
//  acao para seguir outra
export async function validateFollow(req, res, next) {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    const followerId = req.params.id;

    if(!userToken) return res.status(401).send("header invalido")
    try {
        const user = await db.query(`SELECT * FROM sessions WHERE token=$1`, [userToken])
        if(user.rowCount === 0) return res.status(401).send({ message: "token invalido!" })
        const userId = user.rows[0].userId

        // verfifica se tem seguir eu mesmo
        if(followerId === userId) return res.status(401).send({message: "usuario nao pode seguir a si mesmo"})

        const follower = await db.query(`SELECT * FROM users WHERE id=$1`, [followerId])
        if(follower.rowCount === 0) return res.status(404).send({message: "Usuario que deseja seguir nao existe"})
        
        res.locals.userId = userId;
        res.locals.followerId = followerId
        return next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}






