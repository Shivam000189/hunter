import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler<Req extends Request = Request, Res extends Response = Response> = (
  req: Req,
  res: Res,
  next: NextFunction
) => Promise<any> | any;

export const asyncHandler = <Req extends Request = Request, Res extends Response = Response>(
  fn: AsyncRequestHandler<Req, Res>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req as Req, res as Res, next))
      .catch(next);
  };
};
