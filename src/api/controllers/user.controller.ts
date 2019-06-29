import { NextFunction, Request, Response, Router } from 'express';
import { User } from 'api/models';
import { startTimer, apiJson } from 'api/utils/Utils';

export {};

const mongoose = require('mongoose');
const _ = require('lodash');

const { ObjectId } = mongoose.Types;
const httpStatus = require('http-status');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await User.get(id);
    req.route.meta = req.route.meta || {};
    req.route.meta.user = user;
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = async (req: Request, res: Response) => {
  try {
    const user = await User.get(req.params.userId);
    res.json(user.transform());
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.loggedIn = (req: Request, res: Response) => res.json(req.route.meta.user.transform());

exports.create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.route.meta;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

exports.update = (req: Request, res: Response, next: NextFunction) => {
  const ommitRole = req.route.meta.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.route.meta.user, updatedUser);

  user
    .save()
    .then((savedUser: any) => res.json(savedUser.transform()))
    .catch((e: any) => next(User.checkDuplicateEmail(e)));
};

exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    const data = (await User.list(req)).transform(req);
    apiJson({ req, res, data, model: User });
  } catch (e) {
    next(e);
  }
};

exports.remove = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.route.meta;
  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
};

exports.addCard = async (req: Request, res: Response, next: NextFunction) => {
  const addUserDetails = await User.findOne({ username: req.body.username });
  await User.updateOne({ _id: req.params.userId }, { $addToSet: { incomingConnections: addUserDetails._id } })
    .then(async (savedUser: any) => {
      if (savedUser.ok === 1) {
        await User.updateOne(
          { username: req.body.username },
          { $addToSet: { outgoingConnections: req.params.userId } }
        );
        res.json(await User.get(req.params.userId));
      }
    })
    .catch((e: any) => next(e));
};

exports.removeCard = async (req: Request, res: Response, next: NextFunction) => {
  const deleteUserDetails = await User.findOne({ username: req.body.username });
  await User.updateOne({ _id: req.params.userId }, { $pull: { incomingConnections: deleteUserDetails._id } })
    .then(async (deletedUser: any) => {
      if (deletedUser.ok === 1) {
        await User.updateOne({ username: req.body.username }, { $pull: { outgoingConnections: req.params.userId } });
        res.json(await User.get(req.params.userId));
      }
    })
    .catch((e: any) => next(e));
};

exports.shareCard = async (req: Request, res: Response, next: NextFunction) => {
  const addUserDetails = await User.findOne({ username: req.body.username });
  await User.updateOne({ _id: addUserDetails._id }, { $addToSet: { incomingConnections: req.params.userId } })
    .then(async (savedUser: any) => {
      if (savedUser.ok === 1) {
        await User.updateOne(
          { _id: req.params.userId },
          { $addToSet: { outgoingConnections: addUserDetails._id } }
        );
        res.json(await User.get(req.params.userId));
      }
    })
    .catch((e: any) => next(e));
};