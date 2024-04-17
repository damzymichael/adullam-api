import {Request, Response, NextFunction} from 'express';

type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void | Response>;

const asyncWrapper = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const Controller = <T extends {[K in keyof T]: RequestHandler}>(
  controllers: T
) => {
  for (let key of Object.keys(controllers)) {
    controllers[key] = asyncWrapper(controllers[key]);
  }
  return controllers;
};
