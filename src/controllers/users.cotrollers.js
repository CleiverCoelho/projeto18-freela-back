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


// export async function createCustomer(req, res) {
//     const { name, phone, birthday, cpf } = req.body
//     try {
//         await db.query(`
//             INSERT INTO customers (name, phone, birthday, cpf)
//                 VALUES ($1, $2, $3, $4);
//         `, [name, phone, birthday, cpf])
//         res.sendStatus(201)
//     } catch (err) {
//         res.status(500).send(err.message)
//     }
// }

// export async function updateCustomer(req, res) {
//     const { id } = req.params
//     const { name, phone, birthday, cpf } = req.body

//     try {
//         await db.query(`
//             UPDATE customers 
//                 SET name=$1, phone=$2, birthday=$3, cpf=$4
//                 WHERE id=$5;
//         `, [name, phone, birthday, cpf, id])
//         res.sendStatus(200)
//     } catch (err) {
//         res.status(500).send(err.message)
//     }
// } 