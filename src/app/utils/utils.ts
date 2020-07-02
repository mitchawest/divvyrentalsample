import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import { IdentifiedRequestHandler } from '@model/request.model';
import { whitelist, blacklist } from '@util/config';

/* Set the request identifier if included in body, headers, or query. If not included set random value. */
export const identifyRequest: IdentifiedRequestHandler = (req, res, next) => {
  if (req.body && req.body.requestMetaData && req.body.requestMetaData.requestId) {
    req.requestId = req.body.requestMetaData.requestId;
    next();
    return;
  }

  if (req.headers && (req.headers.requestId || req.headers.requestid || req.headers.REQUESTID)) {
    req.requestId = (req.headers.requestId as string) || (req.headers.requestid as string) || (req.headers.REQUESTID as string);
    next();
    return;
  }

  if (req.query && req.query.requestId) {
    req.requestId = String(req.query.requestId);
    next();
    return;
  }
  req.requestId = uuidv4();
  next();
};

/* CORS options. Configure whitelist if desired behavior is to only allow specified origins.
    Configure blacklist if desired behavior is to only disallow specified origins.
    Configure neither if origin filter is not required. */
export const corsHandler: IdentifiedRequestHandler = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  const origin = (req.headers.Origin as string) || (req.headers.ORIGIN as string) || (req.headers.origin as string) || null;

  if (origin && whitelist && whitelist.length) {
    if (whitelist.indexOf(origin) !== -1 || whitelist.indexOf(origin.toUpperCase()) !== -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      next();
      return;
    }
    next(new Error(`Unauthorized. Origin ${origin} not allowed by CORS policy.`));
    return;
  }
  if (origin && blacklist && blacklist.length) {
    if (blacklist.indexOf(origin) !== -1 || blacklist.indexOf(origin.toUpperCase()) !== -1) {
      next(new Error(`Unauthorized. Origin ${origin} not allowed by CORS policy.`));
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

export const authHandler: IdentifiedRequestHandler = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) {
      next(new Error('Unauthorized. Please provide a valid bearer token'));
      return;
    }
    jwt.verify(token, process.env.JWT_KEY);
    req.authorized = true;
  } catch (err) {
    next(new Error(err));
  }
  next();
};
