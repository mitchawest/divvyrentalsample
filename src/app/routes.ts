import express from 'express';
import { authHandler } from '@util/utils';
import swaggerUiService from '@service/swaggerui.service';
import stationHandler from '@feature/station.feature';
import riderHandler from '@feature/rider.feature';
import tripHandler from '@feature/trip.feature';

const router = express.Router();

router.use('/', swaggerUiService.serve);
router.get('/', (req, res, next) => swaggerUiService.setup(req, res, next));

/* Protected routes */
router.get('/station', [authHandler, stationHandler.get]);
router.get('/rider', [authHandler, riderHandler.get]);
router.get('/trip', [authHandler, tripHandler.get]);

export default router;
