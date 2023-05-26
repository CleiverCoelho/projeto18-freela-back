import { db } from "../database/database.connection.js"
import { nanoid } from 'nanoid'


export async function shortUrl(req, res) {
    const {url} = req.body;
    const userId = res.locals.userId

    // let mainUrl = '';
    // let especifyUrl = '';
    // let barCounter = 0
    // url.split('').forEach(caractere => {
    //     if(caractere === '/' && barCounter < 3) {
    //         barCounter++
    //     }else  if(barCounter >= 3){
    //         especifyUrl += caractere;
    //     }
    //     else if(barCounter === 2){
    //         mainUrl += caractere;
    //     }
    // })
    const shortUrl = nanoid(6)
    try {
        // criando tabela com o short id
        await db.query(`INSERT INTO urls (name, "userId", "shortUrl", views)
            VALUES ($1, $2, $3, $4)    
        `, [url, userId, shortUrl, 0])
        
       
        const {rows: createdId} = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl])
        // console.log(response)
        const response = {
            id: createdId[0].id,
            shortUrl: createdId[0].shortUrl
        }
        res.status(201).send(response);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrlById(req, res) {
    const {url} = res.locals;
    try {
        const response = {
            id: url.id,
            shortUrl: url.shortUrl,
            url: url.name
        }
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function openShortUrl(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const {url, views, shortUrl} = res.locals;
    try {
        await db.query(`UPDATE urls SET views=$1 WHERE "shortUrl"=$2`,
        [views + 1, shortUrl])
        const {rows: urlInfo} = await db.query(`SELECT name AS url FROM urls WHERE "shortUrl"=$1`, [shortUrl])
        const path = urlInfo[0].url;
        res.redirect(302, path);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrlById(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const {urlId} = res.locals;
    try {
        await db.query(`DELETE FROM urls WHERE id=$1`,
        [urlId])
        res.status(204).send("excluido com sucesso");
    } catch (err) {
        res.status(500).send(err.message)
    }
}



