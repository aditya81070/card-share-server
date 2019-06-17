import * as Joi from 'joi';

export {};

const cardObj = {
  userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
  contact: Joi.array().items(Joi.string().regex(/^[a-fA-F0-9]{24}$/))
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
