import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
import { IdentifiedRequestHandler } from '@model/request.model';
import { okResponse } from '@service/response.service';
import logger from '@service/logger.service';
import cacheService from '@service/cache.service';
import Station from '@model/station.model';
import swaggerUiService from '@service/swaggerui.service';

export const getStationData = async (): Promise<{[key: string]: Station}> => {
  /* Retrieve cached station data or get from public URL and set cache */
  let stationData: {[key: string]: Station} = cacheService.get('stations');
  if (!stationData) {
    const stationMap: {[key: string]: Station} = {};
    const response = await (await fetch(process.env.STATION_DATA_URL, { method: 'GET' })).json();
    if (response.data && response.data.stations) {
      /* eslint-disable */
      response.data.stations.forEach((station: {eightd_has_key_dispenser: boolean, external_id: string, station_id: string, short_name: string,
      station_type: string, name: string, has_kiosk: boolean, rental_uris: {ios: string, android: string}, eightd_station_services: string[],
      rental_methods: string[], electric_bike_surcharge_waiver: boolean, lat: number, lon: number, capacity: number}) => {
        stationMap[station.station_id] = new Station(station.eightd_has_key_dispenser, station.external_id, station.station_id, station.short_name,
            station.name, station.has_kiosk, station.rental_uris, station.eightd_station_services, station.rental_methods, station.electric_bike_surcharge_waiver,
            station.lat, station.lon, station.capacity);
      });
      /* eslint-enable */
      stationData = stationMap;
      cacheService.set('stations', stationMap, response.data.ttl || 300);
    }
  }
  return stationData;
};

const stationHandler: { get: IdentifiedRequestHandler } = {
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
      const validParams: string[] = (swaggerUiService.getConfig() as {paths: {'/station': {get: {parameters: {in: string, name: string}[]}}}}).paths['/station'].get.parameters
        .filter((param) => param.in === 'query').map((param) => param.name);
      const queryParams: string[] = Object.keys(req.query);
      for (let i = 0; i < queryParams.length; i += 1) {
        if (!validParams.includes(queryParams[i])) {
          next(new Error(`Bad request. Query parameter ${queryParams[i]} is not valid.`));
          return;
        }
      }

      const stations = await getStationData();
      if (!stations[req.query.stationId as string]) {
        next(new Error(`Not found. Station not found for ID ${req.query.stationId}`));
        return;
      }
      okResponse(req, res, stations[req.query.stationId as string]);
      logger.info(`Request processed | Method: ${req.method} | Route: ${req.path} | Identifier: ${req.requestId} | Time: ${Number((performance.now() - t) / 1000).toPrecision(4)} seconds`);
    } catch (err) {
      next(err);
    }
  },
};

export default stationHandler;
