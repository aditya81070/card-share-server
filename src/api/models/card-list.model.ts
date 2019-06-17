import { transformData, listData } from 'api/utils/ModelUtils';

export {};
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('api/utils/APIError');

const cardList = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
  },
  {
    timestamps: true
  }
);
const ALLOWED_FIELDS = ['id', 'userId', 'contact'];

/**
 * Methods
 */
cardList.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"
  transform({ query = {} }: { query?: any } = {}) {
    // transform every record (only respond allowed fields and "&fields=" in query)
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

/**
 * Statics
 */
cardList.statics = {
  async get(id: any) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id)
          .populate('userId')
          .populate({
            path: 'contact'
          })
          .exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
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

const CardList = mongoose.model('CardList', cardList);
CardList.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = CardList;
