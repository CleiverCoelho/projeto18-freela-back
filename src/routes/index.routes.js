import { Router } from "express"
import usersRouter from "./users.routes.js"
import logsRouter from "./logs.routes.js"

const router = Router()
router.use(usersRouter)
router.use(logsRouter)

export default router