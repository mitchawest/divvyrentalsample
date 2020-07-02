import WinstonLogger from '@model/logger.model';
/* Instantiates a winston logger and dynamically creates methods for each log level defined in enums.
    It allows for a logger[level] method instead of directly using WinstonLogger.log() */
const logger: { init: (levels?: WinstonLogger['levels'], colors?: WinstonLogger['colors']) => void, [key: string]: (message?: string | object) => void } = {
  init: (levels?: WinstonLogger['levels'], colors?: WinstonLogger['colors']) => {
    if (!levels) throw new Error('Log levels must be defined');
    /* Create winston logger */
    const winstonInstance = new WinstonLogger(
      process.env.DEFAULTLOGLEVEL || 'info',
      levels,
      colors,
      process.env.NAMESPACE || undefined,
      !(process.env.LOGCONSOLE && process.env.LOGCONSOLE.toUpperCase() === 'FALSE'),
    );
    Object.keys(levels).forEach((level) => {
      logger[level] = (message?: string | object): void => winstonInstance.log(message, level);
    });
  },
};

export default logger;
