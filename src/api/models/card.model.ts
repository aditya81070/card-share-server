import { transformData, listData } from 'api/utils/ModelUtils';

export {};
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const APIError = require('api/utils/APIError');

const cardSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'card1'
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    contact: {
      type: String,
      minlength: 10,
      maxlength: 10,
      trim: true
    },
    alternateContact: {
      type: String,
      minlength: 10,
      maxlength: 10,
      trim: true
    },
    addressOffice: {
      type: 'String',
      minlength: 10
    },
    addressHome: {
      type: 'String',
      minlength: 10
    },
    company: {
      type: String
    },
    designation: {
      type: String
    },
    website: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const ALLOWED_FIELDS = [
  'id',
  'type',
  'name',
  'email',
  'contact',
  'alternateContact',
  'addressOffice',
  'addressHome',
  'company',
  'designation',
  'website'
];

/**
 * Methods
 */
cardSchema.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"
  transform({ query = {} }: { query?: any } = {}) {
    // transform every record (only respond allowed fields and "&fields=" in query)
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

/**
 * Statics
 */
cardSchema.statics = {
  async get(id: any) {
    try {
      let card;

      if (mongoose.Types.ObjectId.isValid(id)) {
        card = await this.findById(id).exec();
      }
      if (card) {
        return card;
      }

      throw new APIError({
        message: 'Card does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List cards.
   * @returns {Promise<User[]>}
   */
  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  }
};

const Card = mongoose.model('Card', cardSchema);
Card.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Card;
