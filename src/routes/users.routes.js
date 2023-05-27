import { Router } from "express"
import { validateUserHeader } from "../middlewares/users.middleware.js"
import { getProfileData } from "../controllers/users.cotrollers.js"
import { createNewPost } from "../controllers/users.cotrollers.js"
import { validateUserHeaderPost } from "../middlewares/users.middleware.js"
import { newPostSchema } from "../schemas/users.schemas.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"

const usersRouter = Router()

// Rota autenticada
usersRouter.get("/users/", validateUserHeader, getProfileData)
usersRouter.post("/users/posts", validateSchema(newPostSchema), validateUserHeaderPost, createNewPost)
usersRouter.get("/users", validateUserHeader, getProfileData)

export default usersRouter