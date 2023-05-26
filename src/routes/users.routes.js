import { Router } from "express"

import validateSchema from "../middlewares/validateSchema.middleware.js"
import { signUpSchema, signInSchema } from "../schemas/users.schemas.js"
import { signUpUser, signInUser, getUserData } from "../controllers/users.cotrollers.js"
import { validateSignUpEmail, validateSignIn, validateUserHeader } from "../middlewares/users.middleware.js"
import { getAllUsers } from "../controllers/users.cotrollers.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSchema(signUpSchema), validateSignUpEmail, signUpUser)
usersRouter.post("/signin", validateSchema(signInSchema), validateSignIn,signInUser)
usersRouter.get("/users", getAllUsers)
usersRouter.get("/users/me", validateUserHeader, getUserData)


// customersRouter.post("/customers", validateSchema(customerSchema), validateCustomerCpf, createCustomer)
// customersRouter.put("/customers/:id", validateSchema(customerSchema),validateCustomerCpf,  updateCustomer)

export default usersRouter