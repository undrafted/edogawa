import { Config, Report, UserInfo, DevConfig } from './types';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, EventTrailManager } from './lib/events';
import { RestClient } from './lib/rest';
import { getUserInfo } from './lib/user-info';

let restClient: RestClient;
let exceptionCb: (report: Report) => void;
let devConfiguration: DevConfig = { clientSideDebug: false };
let configuration: Config = { ignore: [], additionalInfo: {}, endpoint: '' };
let evTrail: EventTrailManager;

export const init = (
  config: Config,
  exceptionCallback?: (report: Report) => void,
  devConfig?: DevConfig,
) => {
  const { endpoint, restToken, maxTrailSize, ignore = [], additionalInfo = {} } = config;

  if (!endpoint) {
    throw new Error(`Invalid url is passed to Edogawa init: ${endpoint}`);
  }

  configuration = {
    ignore,
    additionalInfo,
    endpoint,
    maxTrailSize,
  };

  // create restClient
  restClient = new RestClient(endpoint, restToken);

  if (exceptionCallback) {
    exceptionCb = exceptionCallback;
  }

  if (devConfig) {
    devConfiguration = devConfig;
  }

  evTrail = new EventTrailManager(config.maxTrailSize);

  // listen to usual interactive events
  attachListeners(evTrail.callback);

  self.addEventListener('error', captureException);
};

const captureException = ({ message, filename, lineno, colno, error }: ErrorEvent) => {
  //dont do anything if its in ignore list
  if (
    configuration.ignore &&
    configuration.ignore.some((regexp) => regexp.test(message.toString()))
  ) {
    return;
  }

  const report = composeException(message, filename, lineno, colno, error);

  // clean slate
  evTrail.clearEventTrail();

  if (!devConfiguration.clientSideDebug) {
    // push to endpoint
    restClient.throttledPost(report);
  }

  if (exceptionCb) {
    exceptionCb(report);
  }
};

const composeException = (
  message: string | Event,
  filename: string | undefined,
  lineno: number | undefined,
  colno: number | undefined,
  error: Error | undefined,
): Report => {
  const userInfo: UserInfo = getUserInfo(self.navigator.userAgent);

  if (isSriptError(message.toString())) {
    return {
      exception: {
        message: SCRIPT_ERROR_MESSAGE,
      },
      ...(userInfo && { userInfo: userInfo }),
    };
  }

  const { name, stack } = error || { name: '', stack: '' };

  return {
    exception: {
      message: message.toString(),
      ...(name && { name: name }),
      ...(stack && { stackTrace: stack }),
      ...(filename && { source: filename }),
      ...(lineno && { lineno: lineno }),
      ...(colno && { colno: colno }),
      ...configuration.additionalInfo,
    },
    ...(userInfo && { userInfo: userInfo }),
    trail: evTrail.getEventTrail(),
  };
};
