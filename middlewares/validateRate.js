import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateRate ( req, res, next ) {
    const rateSchema = Joi.object({
    rating: Joi.number().required(),
    bookId: Joi.string().required(),
    });
    const [ validationErr, validInputs ] = await asyncWrapper( rateSchema.validateAsync(req.body) );
    if ( !validationErr )
    {
        req.rate = validInputs;
        return next();
    }
    return next(validationErr)
}

export default validateRate;
