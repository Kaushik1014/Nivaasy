const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().valid("trending", "rooms", "iconic_cities", "mountains", "castles", "pools", "camping", "farms", "artic", "deserts").optional(),

    lat: Joi.number().optional(),
    lng: Joi.number().optional(),

    image: Joi.object({
      url: Joi.string().allow("", null)
    }).optional()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
});