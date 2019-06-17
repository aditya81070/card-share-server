export {};
const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/card-list.controller');
const { authorize } = require('../../middlewares/auth');
const { listCards, createCard, replaceCard, updateCard } = require('../../validations/card-list.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('cardListId', controller.load);

router
  .route('/')

  .get(authorize(), validate(listCards), controller.list)

  .post(authorize(), validate(createCard), controller.create);

router
  .route('/:cardListId')

  .get(authorize(), controller.get)

  .put(authorize(), validate(replaceCard), controller.replace)

  .patch(authorize(), validate(updateCard), controller.update)

  .delete(authorize(), controller.remove);

router.route('/user/:userId').get(authorize(), controller.getContacts);

module.exports = router;
