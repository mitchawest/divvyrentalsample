import { performance } from 'perf_hooks';
import { IdentifiedRequestHandler } from '@model/request.model';
import { okResponse } from '@service/response.service';
import logger from '@service/logger.service';
import cacheService from '@service/cache.service';
import Trip from '@model/trip.model';
import swaggerUiService from '@service/swaggerui.service';

const parseTripsByStationDate = (trips: {[key: string]: Trip[]}, stationId: string): { [key: string]: string | Trip[]} => {
  const tripsByStation = trips[stationId];
  if (!tripsByStation) return null;
  /* eslint-disable */
  const returnMap: {[key: string]: string | Trip[]} = { stationId: stationId };
  /* eslint-enable */
  tripsByStation.sort((a, b) => b.endTime.getTime() - a.endTime.getTime()).forEach((trip) => {
    if (!returnMap[trip.endTime.toISOString().split('T')[0]]) returnMap[trip.endTime.toISOString().split('T')[0]] = [];
    if (returnMap[trip.endTime.toISOString().split('T')[0]].length < 20) (returnMap[trip.endTime.toISOString().split('T')[0]] as Trip[]).push(trip);
  });
  return returnMap;
};

const tripHandler: { get: IdentifiedRequestHandler } = {
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
      const validParams: string[] = (swaggerUiService.getConfig() as {paths: {'/trip': {get: {parameters: {in: string, name: string}[]}}}}).paths['/trip'].get.parameters
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
      const returnVal = (req.query.stationId as string).split(',').map((stationId) => parseTripsByStationDate(trips, stationId)).filter((tripData) => !!tripData);

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

export default tripHandler;
