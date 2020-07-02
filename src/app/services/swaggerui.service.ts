import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import { RequestHandler } from 'express';
import logger from '@service/logger.service';

const swaggerUiService: {init: (configPath: string, options: {supportHeaderParams: boolean, customSiteTitle: string})=>void,
setup: RequestHandler, serve: RequestHandler[], config: string | object, getConfig: ()=> string | object} = {
  setup: null,
  config: {},
  init: (configPath: string, options: {supportHeaderParams: boolean, customSiteTitle: string}) => {
    try {
      const config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
      swaggerUiService.config = config;
      swaggerUiService.setup = swaggerUi.setup(config as unknown, options);
    } catch (yamlErr) {
      logger.debug(`Could not load OpenAPI config yaml: ${yamlErr}`);
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8').toString());
        swaggerUiService.config = config;
        swaggerUiService.setup = swaggerUi.setup(config as unknown, options);
      } catch (jsonErr) {
        logger.debug(`Could not load OpenAPI config json: ${jsonErr}`);
      }
    }
  },
  serve: swaggerUi.serve,
  getConfig: () => swaggerUiService.config,
};

export default swaggerUiService;
