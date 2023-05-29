import { db } from "../database/database.connection.js"


export async function getProfileData(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const userId = res.locals.userId;

    try {
        const {rows: posts} = await db.query(`SELECT posts.description, pictures.img_url AS "imgUrl", 
        posts.likes, posts."createdAt"   
        FROM posts
        JOIN pictures ON pictures.id=posts."imgId"
        WHERE posts."userId"=$1
        `, [userId])
        
        const {rows: profileInfo} = await db.query(`SELECT users.name, users.followers,
            users.following, users.biography, 
            pictures.img_url AS "profileImgUrl" 
            FROM users
            JOIN pictures ON pictures."userId"=users.id
            WHERE users.id=$1
            `, [userId])
        const {rows: teste} = await db.query(`SELECT * FROM users WHERE id=$1`, [userId])
        console.log(teste)

        console.log(profileInfo)
        const response = {
            ...profileInfo[0],
            posts: [...posts]
        }
        res.send(response).status(200);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getProfileVisitorData(req, res) {
    // AINDA FALTA REDIRECIONAR O USUARIO
    const visitorId = req.params.id;
    const userId = res.locals.userId

    try {
        const {rows: posts} = await db.query(`SELECT posts.description, pictures.img_url AS "imgUrl", 
        posts.likes, posts."createdAt"   
        FROM posts
        JOIN pictures ON pictures.id=posts."imgId"
        WHERE posts."userId"=$1
        `, [visitorId])
        
        const {rows: profileInfo} = await db.query(`SELECT users.name, users.followers,
            users.following, users.biography, 
            pictures.img_url AS "profileImgUrl" 
            FROM users
            JOIN pictures ON pictures."userId"=users.id
            WHERE users.id=$1
            `, [visitorId])

        // checar pra ver se o usuario segueu o perfil visitado
        const followingVisitor = await db.query(`SELECT * FROM connections 
            WHERE follow=$1 AND follower=$2
            `, [userId, visitorId])

        const response = {  
            ...profileInfo[0],
            posts: [...posts],
            doiFollow: followingVisitor.rowCount
        }

        res.send(response).status(200);
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


export async function createNewConnection(req, res) {
    const {userId, followerId} = res.locals
    try {
        const {rows : users} = await db.query(`INSERT INTO connections (follow, follower) 
            VALUES ($1, $2)
        `, [userId, followerId])
        
        // atualiza numero de seguir/seguindo em cada perfil
        const {rows : numberFollowing} = await db.query(`SELECT following FROM users WHERE id=$1`, [userId])
        await db.query(`UPDATE users SET following=$1 WHERE id=$2`, [numberFollowing[0].following + 1, userId])

        const {rows: numberFollower} = await db.query(`SELECT followers FROM users WHERE id=$1`, [followerId])
        await db.query(`UPDATE users SET followers=$1 WHERE id=$2`, [numberFollower[0].followers + 1, followerId])
        console.log(numberFollower[0].followers)
        // relaciona a imagem do post com a imagem criada em pictures
        
        res.send({message: "seguido com sucesso"}).status(200);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUsers(req, res, next) {
    try {
        const {rows: users} = await db.query(`SELECT * FROM pictures`)
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
