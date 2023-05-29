import { Router } from "express"
import { validateFollow, validateUserHeader } from "../middlewares/users.middleware.js"
import { createNewConnection, getFollowers, getFollowing, getProfileData, getProfileVisitorData, getUsers } from "../controllers/users.cotrollers.js"
import { createNewPost } from "../controllers/users.cotrollers.js"
import { validateUserHeaderPost } from "../middlewares/users.middleware.js"
import { newPostSchema } from "../schemas/users.schemas.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"

const usersRouter = Router()

// Rota autenticada
usersRouter.post("/users/posts", validateSchema(newPostSchema), validateUserHeaderPost, createNewPost)
usersRouter.get("/users", validateUserHeader, getProfileData)
usersRouter.post("/users/follow/:id", validateFollow, createNewConnection)
usersRouter.get("/users/visitor/:id", validateUserHeader, getProfileVisitorData)
usersRouter.get("/users/following", validateUserHeader, getFollowing)
usersRouter.get("/users/followers", validateUserHeader, getFollowers)


usersRouter.get("/teste/users", getUsers)


export default usersRouter