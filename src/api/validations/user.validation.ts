import * as Joi from 'joi';
import { User } from 'api/models';

export {};

module.exports = {
  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
      username: Joi.string()
        .min(3)
        .max(30),
      contact: Joi.string()
        .min(10)
        .max(10)
    }
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      username: Joi.string()
        .min(3)
        .max(30),
      contact: Joi.string()
        .min(10)
        .max(10)
    }
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      username: Joi.string()
        .min(3)
        .max(30),
      contact: Joi.string()
        .min(10)
        .max(10)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string()
        .min(6)
        .max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      username: Joi.string()
        .min(3)
        .max(30),
      contact: Joi.string()
        .min(10)
        .max(10)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
