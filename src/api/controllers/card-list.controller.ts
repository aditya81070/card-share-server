import { NextFunction, Request, Response } from 'express';
import { CardList } from 'api/models';
import { startTimer, apiJson } from 'api/utils/Utils';

export {};

const httpStatus = require('http-status');
const { omit } = require('lodash');

exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const cardList = await CardList.get(id);
    req.route.meta = req.route.meta || {};
    req.route.meta.cardList = cardList;
    return next();
  } catch (error) {
    res.json({ code: 404, message: 'Card not found' });
  }
};

exports.get = (req: Request, res: Response) => res.json(req.route.meta.cardList.transform());

exports.create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardList = new CardList(req.body);
    const savedCardList = await cardList.save();
    res.status(httpStatus.CREATED);
    res.json(savedCardList.transform());
  } catch (error) {
    res.send(error.message);
    res.status(500);
  }
};

exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardList } = req.route.meta;
    const newCardList = new CardList(req.body);
    const newCardListObject = omit(newCardList.toObject(), '_id');
    console.log(newCardListObject);
    await cardList.update(newCardListObject, { override: true, upsert: true });
    const savedCardList = await CardList.findById(cardList._id);
    res.json(savedCardList.transform());
  } catch (error) {
    res.send(error.message);
  }
};

exports.update = (req: Request, res: Response, next: NextFunction) => {
  const cardList = Object.assign(req.route.meta.cardList, req.body);
  cardList
    .save()
    .then((savedCardList: any) => res.json(savedCardList.transform()))
    .catch((e: any) => res.send(e.message));
};

exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    const data = (await CardList.list(req)).transform(req);
    apiJson({ req, res, data, model: CardList });
  } catch (e) {
    next(e);
  }
};

exports.remove = (req: Request, res: Response, next: NextFunction) => {
  const { card: cardList } = req.route.meta;
  cardList
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
  res.send(true);
};

exports.getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const contacts = await CardList.find({ userId })
      .populate('userId')
      .populate({
        path: 'contact'
      })
      .exec();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};
