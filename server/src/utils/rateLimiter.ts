import * as RateLimiter from "rate-limiter-flexible";
import { dbConn } from "../db";

const rateLimiterOptions = {
  storeClient: dbConn,
  storeType: "knex",
  tableName: "api_calls",
  keyPrefix: "", // This can be used to differentiate the different apis
  blockDuration: 10,
  points: 10, // Number of points
  duration: 60 // Per second(s)
};

const rateLimiter = new RateLimiter.RateLimiterPostgres(
  rateLimiterOptions,
  err => {
    if (err) {
      console.error(err);
    }
  }
);

export async function isUserAllowedToConsumeAPI(userId: number) {
  try {
    await rateLimiter.consume(userId.toString(), 5);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    }
    return false;
  }
}

const publicRateLimiter = new RateLimiter.RateLimiterPostgres(
  { ...rateLimiterOptions, points: 5, keyPrefix: "ip_" },
  err => {
    if (err) {
      console.error(err);
    }
  }
);

export async function isIPAllowedToConsumeAPI(ip: string) {
  try {
    await publicRateLimiter.consume(ip, 5);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw error;
    }
    return false;
  }
}
