import { db } from "../database/database.connection.js"

export async function getRanking(req, res) {
    try {
        const {rows: ranking} = await db.query(`SELECT users.id, users.name, 
        SUM(urls.views) AS "visitCount", COUNT(urls.id) AS "linksCount"
        FROM urls
        JOIN users ON users.id=urls."userId"
        GROUP BY users.id, users.name
        ORDER BY "visitCount" DESC LIMIT 10`)

        
        
        // const response = ranking.map((res, index) => {
        //     return {...res, ...linksCount[index]}
        // })
        res.status(200).send(ranking);
    } catch (err) {
        res.status(500).send(err.message)
    }
}
