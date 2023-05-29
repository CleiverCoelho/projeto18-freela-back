import { db } from "../database/database.connection.js"
import bcrypt from 'bcrypt';
import {v4 as uuid} from "uuid";
import { imagemPadrao } from "./imagemPadrao.js";


export async function signUpUser(req, res) {
    const {name, email, password, biography} = req.body;
    const encriptedPassword = bcrypt.hashSync(password, 10);
    const defaultPictureId = 1; // ID DA IMAGEM PADRAO CADASTRADA NO BANCO DE DADOS
    try {
        // cria uma imagem padrao
        
        await db.query(`INSERT INTO users (name, email, password, biography, "mainPictureId") 
            VALUES ($1, $2, $3, $4, $5);`, [name, email, encriptedPassword, biography, defaultPictureId]);

        const {rows: user} = await db.query(`SELECT id FROM users WHERE email=$1`, [email])

        await db.query(`INSERT INTO pictures (img_url, "userId") 
            VALUES ($1, $2) 
        `, [imagemPadrao, user[0].id])

        // pega o id da ultima imagem adicionada na tabela
        const {rows : pictureCreated} = await db.query(`SELECT img_url, id FROM pictures 
            WHERE "userId"=$1 ORDER BY id DESC`, [user[0].id])
        
        // atualiza o mainPicture id do users
        await db.query(`UPDATE users SET "mainPictureId"=$1 WHERE id=$2`, [pictureCreated[0].id, user[0].id])

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signInUser(req, res) {
    try {
        const token = uuid();
        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`,
        [res.locals.userId, token])
        res.status(200).send({token})
    } catch (err) {
        res.status(500).send(err.message)
    }
}