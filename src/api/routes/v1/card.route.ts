export {};
const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/card.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { listCards, createCard, replaceCard, updateCard } = require('../../validations/card.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('cardId', controller.load);

router
  .route('/')

  .get(authorize(), validate(listCards), controller.list)

  .post(authorize(), validate(createCard), controller.create);

router
  .route('/:cardId')

  .get(authorize(), controller.get)

  .put(authorize(), validate(replaceCard), controller.replace)

  .patch(authorize(), validate(updateCard), controller.update)

  .delete(authorize(), controller.remove);

module.exports = router;
