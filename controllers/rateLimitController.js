const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const { login } = require('./authController');
const AppError = require('../utils/appError');

const redisClient = new Redis(process.env.REDIS_URL, { enableOfflineQueue: false });

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 100;

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  // useRedisPackage: true,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

exports.rateLimiter = catchAsync(async (req, res, next) => {
  const ipAddr = req.ip;
  const usernameIPkey = getUsernameIPkey(req.body.username, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0;

  console.log('resUsernameAndIP', resUsernameAndIP);
  console.log('resSlowByIP', resSlowByIP);

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    return next(new AppError("too_many_requests_message", 429));
  } else {
    if (!res.locals.userDetails) {
      console.log("HERE1");
      await login(req, res, next); // should be implemented in your project
    } else {
      
    }
    console.log('res.locals.userDetails', res.locals.userDetails);

    // if (!user || !user.isLoggedIn) {
    //   // Consume 1 point from limiters on wrong attempt and block if limits reached
    //   try {
    //     // console.log('HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    //     const promises = [limiterSlowBruteByIP.consume(ipAddr)];
    //     if (user?.exists) {
    //       // Count failed attempts by Username + IP only for registered users
    //       promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
    //     }

    //     await Promise.all(promises);

    //     return next(new AppError("invalid_credentials_message", 400));
    //   } catch (rlRejected) {
    //     console.log('qweqeqeqwewqweqeqewq');
    //     if (rlRejected instanceof Error) {
    //       console.log('qweqeqeqwewqweqeqewq2');
    //       throw rlRejected;
    //     } else {
    //       res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
    //       return next(new AppError("too_many_requests_message", 429));
    //     }
    //   }
    // }
    // next();

    // if (user.isLoggedIn) {
    //   if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
    //     // Reset on successful authorisation
    //     await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
    //   }

    //   res.end('authorized');
    // }
  }
});