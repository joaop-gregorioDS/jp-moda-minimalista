import type { NextFunction, Request, RequestHandler, Response } from "express";

export function ah<Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    void fn(req as Req, res, next).catch(next);
  };
}
