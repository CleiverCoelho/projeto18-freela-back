import { db } from "../database/database.connection.js"


export async function getProfilePosts(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const userId = res.locals.userId;

    try {
        const {rows: posts} = await db.query(`SELECT posts.description, pictures.img_url AS "imgUrl", 
        posts.likes, posts."createdAt"   
        FROM posts
        JOIN users ON users.id=posts."userId"
        JOIN pictures ON pictures."userId"=posts."userId"
        WHERE posts."userId"=$1
        `, [userId])
        
        // console.log(response)
        res.send(posts).status(200);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createNewPost(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const userId = res.locals.userId;
    const imgUrl = res.locals.imgUrl;
    const description = res.locals.description;

    // é preciso adicionar a foto na table pictures pois
    // o post precisa fazer refrencia a uma foto existente

    try {
        await db.query(`INSERT INTO pictures (img_url, "userId") 
            VALUES ($1, $2) 
        `, [imgUrl, userId])

        // pega o id da ultima imagem adicionada na tabela
        const {rows : pictureCreated} = await db.query(`SELECT img_url, id FROM pictures 
            WHERE "userId"=$1 ORDER BY id DESC`, [userId])
        
        // relaciona a imagem do post com a imagem criada em pictures
        const imgId = pictureCreated[0].id
        await db.query(`INSERT INTO posts (description, "userId", "imgId") 
            VALUES ($1, $2, $3)`, [description, userId, imgId])
        
        res.send({message: "post criado com sucesso"}).status(200);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUserData(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const userId = res.locals.userId
    try {
        const {rows: userInfo} = await db.query(`SELECT users.id, users.name, SUM(urls.views) AS "visitCount"   
            FROM urls
            JOIN users ON users.id=urls."userId"
            WHERE urls."userId"=$1
            GROUP BY users.id, users.name

        `, [userId])
        const {rows: shortUrls} = await db.query(`SELECT id, "shortUrl", name AS url, "views" AS "visitCount"
            FROM urls WHERE urls."userId"=$1`, 
            [userId])
        
        const response = {...userInfo[0], shortenedUrls: shortUrls}
        // console.log(response)
        res.send(response).status(200);
    } catch (err) {
        res.status(500).send(err.message)
    }
}


export async function getAllUsers(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    try {
        const users = await db.query(`SELECT * FROM users`)
        res.status(204).send(users.rows[0]);
    } catch (err) {
        res.status(500).send(err.message)
    }
}
