import type { NextFunction, Response, RequestHandler } from "express";
import type { IAuthRequest } from "~/types";

// Constrain RequestType to extend IAuthRequest
type AsyncHandler<
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Body = {},
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Params = {},
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Query = {},
> = (
  req: IAuthRequest<Body, Params, Query>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler = <
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Body = {},
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Params = {},
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Query = {},
>(
  requestHandler: AsyncHandler<Body, Params, Query>,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(
      requestHandler(req as IAuthRequest<Body, Params, Query>, res, next),
    ).catch(next);
  };
};
