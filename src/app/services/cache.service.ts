import NodeCache from 'node-cache';

const cacheService = new NodeCache({ checkperiod: 60, useClones: false, deleteOnExpire: true });

export default cacheService;
