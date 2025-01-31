import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

// Connect to Redis
const redisClient = new Redis("redis://localhost:6379");

// Configure Rate Limiter with Redis
export const limiter = rateLimit({
  store: new RedisStore({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    sendCommand: async (...args: [string, ...string[]]): Promise<any> => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return (await redisClient.call(...args)) as any; // Explicitly cast return type
    },
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
