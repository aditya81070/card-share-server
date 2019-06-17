import * as express from 'express';
import { apiJson } from 'api/utils/Utils';

export {};

const userRoutes = require('./user.route');
const cardRoutes = require('./card.route');
const authRoutes = require('./auth.route');
const uploadRoutes = require('./upload.route');
const cardListRoutes = require('./card-list.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => {
  apiJson({ req, res, data: { status: 'OK' } });
  return next();
});

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/cards-list', cardListRoutes);
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
