import { performance } from 'perf_hooks';
import { IdentifiedRequestHandler } from '@model/request.model';
import { okResponse } from '@service/response.service';
import logger from '@service/logger.service';
import cacheService from '@service/cache.service';
import Trip from '@model/trip.model';
import swaggerUiService from '@service/swaggerui.service';

interface RiderByAge { [key: string]: { rentalId: number; bikeId: number; userType: string; userGender: string; userBirthYear: number; }[]; }

/* Maps trip data by station id into rider information by station, date, and age */
const parseRidersByTripDateAge = (trips: {[key: string]: Trip[]}, stationId: string): {[key: string]: string | {[key: string]: {rentalId: number, bikeId: number, userType: string,
    userGender: string, userBirthYear: number}[]}} => {
  const tripsByStation = trips[stationId];
  if (!tripsByStation) return null;
  /* eslint-disable */
  const returnMap: {[key: string]: string | {[key: string]: {rentalId: number, bikeId: number, userType: string, 
        userGender: string, userBirthYear: number}[]}} = { stationId: stationId };
  /* eslint-enable */
  tripsByStation.sort((a, b) => a.endTime.getTime() - b.endTime.getTime()).forEach((trip) => {
    if (!returnMap[trip.endTime.toISOString().split('T')[0]]) {
      returnMap[trip.endTime.toISOString().split('T')[0]] = {
        '0-20': [],
        '21-30': [],
        '31-40': [],
        '41-50': [],
        '51+': [],
        unknown: [],
      };
    }
    if (!trip.estimatedUserAge) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge).unknown.push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
      return;
    }
    if (trip.estimatedUserAge >= 0 && trip.estimatedUserAge <= 20) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge)['0-20'].push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
      return;
    }
    if (trip.estimatedUserAge >= 21 && trip.estimatedUserAge <= 30) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge)['21-30'].push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
      return;
    }
    if (trip.estimatedUserAge >= 31 && trip.estimatedUserAge <= 40) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge)['31-40'].push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
      return;
    }
    if (trip.estimatedUserAge >= 41 && trip.estimatedUserAge <= 50) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge)['41-50'].push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
      return;
    }
    if (trip.estimatedUserAge >= 51) {
      (returnMap[trip.endTime.toISOString().split('T')[0]] as RiderByAge)['51+'].push({
        rentalId: trip.rentalId, bikeId: trip.bikeId, userType: trip.userType, userGender: trip.userGender, userBirthYear: trip.userBirthYear,
      });
    }
  });
  return returnMap;
};

const riderHandler: { get: IdentifiedRequestHandler } = {
  get: async (req, res, next) => {
    const t = performance.now();
    try {
      logger.info(`Request received | Method: ${req.method} | Route: ${req.path} | Identifier: ${req.requestId}`);
      logger.debug(`Request query: ${JSON.stringify(req.query)}`);
      /* Validate ID submitted in query */
      if (!req.query.stationId) {
        next(new Error('Bad request. Query parameter "stationId" is required'));
        return;
      }
      /* validate query params against openapi config */
      const validParams: string[] = (swaggerUiService.getConfig() as {paths: {'/rider': {get: {parameters: {in: string, name: string}[]}}}}).paths['/rider'].get.parameters
        .filter((param) => param.in === 'query').map((param) => param.name);
      const queryParams: string[] = Object.keys(req.query);
      for (let i = 0; i < queryParams.length; i += 1) {
        if (!validParams.includes(queryParams[i])) {
          next(new Error(`Bad request. Query parameter ${queryParams[i]} is not valid.`));
          return;
        }
      }

      /* Retrieve cached trips */
      const trips: {[key: string]: Trip[]} = cacheService.get('trips');
      if (!trips) {
        next(new Error('Not found. Trip data not loaded.'));
        return;
      }
      const returnVal = (req.query.stationId as string).split(',').map((stationId) => parseRidersByTripDateAge(trips, stationId)).filter((stationData) => !!stationData);

      if (!returnVal.length) {
        next(new Error(`Not found. No data available for submitted stationId(s): ${req.query.stationId}`));
        return;
      }

      okResponse(req, res, returnVal);
      logger.info(`Request processed | Method: ${req.method} | Route: ${req.path} | Identifier: ${req.requestId} | Time: ${Number((performance.now() - t) / 1000).toPrecision(4)} seconds`);
    } catch (err) {
      next(err);
    }
  },
};

export default riderHandler;
