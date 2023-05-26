import { Router } from "express"

import { getUserData } from "../controllers/users.cotrollers.js"
import { validateUserHeader } from "../middlewares/users.middleware.js"
import { getAllUsers } from "../controllers/users.cotrollers.js"

const usersRouter = Router()

usersRouter.get("/users", getAllUsers)
usersRouter.get("/users/me", validateUserHeader, getUserData)

export default usersRouter