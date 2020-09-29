const Joi = require('@hapi/joi');

const itemValidation = data =>{
    const Schema = Joi.object({
        name : Joi.required(),
        description : Joi.required(),
        price : Joi.required(),
        quantity : Joi.required(),
    });
    return Schema.validate(data)
}
const craftValidation = data =>{
    const Schema = Joi.object({
        servicekey : Joi.required(),
        record : Joi.object({
            _id : Joi.required(),
            orderQuantity : Joi.required(),
            orderFlag : Joi.required(),
        })
    });
    return Schema.validate(data)
}

module.exports.itemValidation = itemValidation;
module.exports.craftValidation = craftValidation;