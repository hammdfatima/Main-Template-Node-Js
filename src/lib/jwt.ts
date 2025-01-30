import logger from "~/lib/logger";
import type { TokenPayload } from "~/types";
import jwt from "jsonwebtoken";
import env from "~/env";
const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET);
};

const verifyToken = (token: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return payload;
  } catch (error) {
    logger.error(error);
    throw new Error("Invalid Token");
  }
};

export { createToken, verifyToken };
