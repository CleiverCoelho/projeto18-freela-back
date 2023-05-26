import { db } from "../database/database.connection.js"
import bcrypt from 'bcrypt';

export async function validateSignUpEmail(req, res, next) {
    const { email } = req.body
    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        if (user.rowCount === 0) return next()
        return res.status(409).send({ message: "Email informado já existe!" })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function validateSignIn(req, res, next) {
    const { email, password } = req.body
    try {
        const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        if (user.rowCount === 0) return res.status(401).send({ message: "Email informado não cadastrado!" })
        
        const validatePassword = bcrypt.compareSync(password, user.rows[0].password); 
        if(!validatePassword) return res.status(401).send("senha incorreta");
        res.locals.userId = user.rows[0].id;
        return next()
    } catch (err) {
        res.status(500).send(err.message)
    }
}
