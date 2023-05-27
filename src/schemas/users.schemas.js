import joi from "joi"


export const newPostSchema = joi.object({
    imgUrl: joi.string().uri().trim().required(),
    description: joi.string().trim().required(),

})

