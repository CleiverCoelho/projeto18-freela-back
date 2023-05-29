import joi from "joi"


export const newPostSchema = joi.object({
    imgUrl: joi.string().uri().trim().required(),
    description: joi.string().trim().required(),

})

export const searchSchema = joi.object({
    userName: joi.string().trim().required(),
})

