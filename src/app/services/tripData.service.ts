import fs from 'fs';
import logger from '@service/logger.service';
import Trip from '@model/trip.model';
import cacheService from '@service/cache.service';

/* Reads and parses trip data from local file */
const tripDataService = {
  init: (dataPath: string): void => {
    const tripMap: {[key: string]: Trip[]} = {};
    const readStream = fs.createReadStream(dataPath, { highWaterMark: 100000 });
    readStream.on('error', (err) => logger.error(err));
    readStream.on('open', () => logger.info('Reading and parsing trip data...'));
    readStream.on('end', () => {
      cacheService.set('trips', tripMap, 0);
      logger.info('Trip data loaded successfully');
    });

    let lastRowData = '';
    readStream.on('data', (chunk) => {
      try {
        /* splits each chunk by line feed and removes header or footer rows */
        const dataArray = chunk.toString().split('\n').filter((row) => row.length > 0 && !row.toUpperCase().includes('01 - RENTAL'));
        /* Accounts for rows cutoff by stream chunking */
        dataArray[0] = lastRowData + dataArray[0];
        lastRowData = dataArray.pop();
        /* Convert row to Trip model and add to trip array */
        dataArray.forEach((row) => {
          const trip = new Trip(row);
          if (!tripMap[trip.startStationId]) tripMap[String(trip.startStationId)] = [];
          if (!tripMap[trip.endStationId]) tripMap[String(trip.endStationId)] = [];
          tripMap[trip.startStationId].push(trip);
          if (trip.startStationId !== trip.endStationId) tripMap[trip.endStationId].push(trip);
        });
      } catch (err) {
        logger.error(err);
      }
    });
  },
};

export default tripDataService;
