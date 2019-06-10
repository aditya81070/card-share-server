export {};
const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { listCards, createCard, replaceCard, updateCard } = require('../../validations/card.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('cardId', controller.load);

router
  .route('/')

  .get(authorize(ADMIN), validate(listCards), controller.list)

  .post(authorize(ADMIN), validate(createCard), controller.create);

router
  .route('/:cardId')

  .get(authorize(LOGGED_USER), controller.get)

  .put(authorize(LOGGED_USER), validate(replaceCard), controller.replace)

  .patch(authorize(LOGGED_USER), validate(updateCard), controller.update)

  .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
