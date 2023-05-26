import { Router } from "express"

import validateSchema from "../middlewares/validateSchema.middleware.js"
import { signUpSchema, signInSchema } from "../schemas/logs.schemas.js"
import { signUpUser, signInUser } from "../controllers/logs.controllers.js"
import { validateSignUpEmail, validateSignIn } from "../middlewares/logs.middlewares.js"

const logsRouter = Router()

logsRouter.post("/cadastro", validateSchema(signUpSchema), validateSignUpEmail, signUpUser)
logsRouter.post("/login", validateSchema(signInSchema), validateSignIn,signInUser)

export default logsRouter;