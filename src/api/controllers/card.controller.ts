import { NextFunction, Request, Response } from 'express';
import { Card } from 'api/models';
import { startTimer, apiJson } from 'api/utils/Utils';

export {};

const httpStatus = require('http-status');
const { omit } = require('lodash');

exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const card = await Card.get(id);
    req.route.meta = req.route.meta || {};
    req.route.meta.card = card;
    return next();
  } catch (error) {
    res.json({ code: 404, message: 'Card not found' });
  }
};

exports.get = (req: Request, res: Response) => res.json(req.route.meta.card.transform());

exports.create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = new Card(req.body);
    const savedCard = await card.save();
    res.status(httpStatus.CREATED);
    res.json(savedCard.transform());
  } catch (error) {
    res.send(error.message);
    res.status(500);
  }
};

exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { card } = req.route.meta;
    const newCard = new Card(req.body);
    const newCardObject = omit(newCard.toObject(), '_id');
    console.log(newCardObject);
    await card.update(newCardObject, { override: true, upsert: true });
    const savedCard = await Card.findById(card._id);
    res.json(savedCard.transform());
  } catch (error) {
    res.send(error.message);
  }
};

exports.update = (req: Request, res: Response, next: NextFunction) => {
  const card = Object.assign(req.route.meta.card, req.body);
  card
    .save()
    .then((savedCard: any) => res.json(savedCard.transform()))
    .catch((e: any) => res.send(e.message));
};

exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    const data = (await Card.list(req)).transform(req);
    apiJson({ req, res, data, model: Card });
  } catch (e) {
    next(e);
  }
};

exports.remove = (req: Request, res: Response, next: NextFunction) => {
  const { card } = req.route.meta;
  card
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
  res.send(true);
};
