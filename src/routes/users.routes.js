import { Router } from "express"

import { getUserData } from "../controllers/users.cotrollers.js"
import { validateUserHeader } from "../middlewares/users.middleware.js"
import { getProfilePosts } from "../controllers/users.cotrollers.js"

const usersRouter = Router()

// Rota autenticada
usersRouter.get("/users/posts", validateUserHeader, getProfilePosts)
usersRouter.get("/users/me", validateUserHeader, getUserData)

export default usersRouter