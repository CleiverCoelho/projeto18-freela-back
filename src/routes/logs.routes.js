import { Router } from "express"

import validateSchema from "../middlewares/validateSchema.middleware.js"
import { signUpSchema, signInSchema } from "../schemas/users.schemas.js"
import { signUpUser, signInUser } from "../controllers/users.cotrollers.js"
import { validateSignUpEmail, validateSignIn, validateUserHeader } from "../middlewares/users.middleware.js"

const logsRouter = Router()

logsRouter.post("/cadastro", validateSchema(signUpSchema), validateSignUpEmail, signUpUser)
logsRouter.post("/login", validateSchema(signInSchema), validateSignIn,signInUser)

export default logsRouter;