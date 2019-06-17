import * as Joi from 'joi';

export {};

const cardObj = {
  type: Joi.string(),
  email: Joi.string().regex(/^\S+@\S+\.\S+$/),
  name: Joi.string().max(128),
  contact: Joi.string()
    .min(10)
    .max(10),
  alternateContact: Joi.string()
    .min(10)
    .max(10),
  addressOffice: Joi.string().min(10),
  addressHome: Joi.string().min(10),
  company: Joi.string(),
  designation: Joi.string(),
  website: Joi.string()
};

module.exports = {
  // GET /v1/cards
  listCards: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      ...cardObj
    }
  },

  // POST /v1/cards
  createCard: {
    body: cardObj
  },

  // PUT /v1/cards/:cardId
  replaceCard: {
    body: cardObj,
    params: {
      cardId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // PATCH /v1/cards/:cardId
  updateCard: {
    body: cardObj,
    params: {
      cardId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
