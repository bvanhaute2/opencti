import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async/fixed';
import conf, { logger } from '../config/conf';

// Expired manager responsible to monitor expired elements
// In order to change the revoked attribute to true
// Each API will start is manager.
// When manager do it scan it take a lock and periodically renew it until the job is done.
// If the lock is free, every API as the right to take it.
const SCHEDULE_TIME = conf.get('task_scheduler:interval');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const taskHandler = async () => {
  logger.info('[OPENCTI] Running Task manager');
  await wait(10000);
};

const initTaskManager = () => {
  let scheduler;
  return {
    start: () => {
      scheduler = setIntervalAsync(async () => {
        await taskHandler();
      }, SCHEDULE_TIME);
    },
    shutdown: () => clearIntervalAsync(scheduler),
  };
};

export default initTaskManager;
