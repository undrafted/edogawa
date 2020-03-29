import { Config, Report, EventTrail, UserInfo, DevConfig } from './types';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, eventTrailsCb } from './lib/events';
import { RestClient } from './lib/rest';
import { getUserInfo } from './lib/user-info';

let restClient: RestClient;
let eventTrail: EventTrail[] = [];
let exceptionCb: (report: Report) => void;
let devConfiguration: DevConfig = { clientSideDebug: false };
let configuration: Config = { ignore: [], additionalInfo: {}, endpoint: '' };

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
  };

  // create restClient
  restClient = new RestClient(endpoint, restToken);

  if (exceptionCallback) {
    exceptionCb = exceptionCallback;
  }

  if (devConfig) {
    devConfiguration = devConfig;
  }

  // listen to usual interactive events
  attachListeners(eventTrailsCb(eventTrail, maxTrailSize));

  /* listen for exceptions, hurray
   https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror */
  window.onerror = captureException;
};

const captureException: OnErrorEventHandler = (message, source, lineno, colno, error) => {
  //dont do anything if its in ignore list
  if (
    configuration.ignore &&
    configuration.ignore.some(regexp => regexp.test(message.toString()))
  ) {
    return;
  }

  const report = composeException(message, source, lineno, colno, error);

  // clean slate
  clearEventTrail();

  if (!devConfiguration.clientSideDebug) {
    // push to endpoint
    restClient.post(report);
  }

  if (exceptionCb) {
    exceptionCb(report);
  }
};

const clearEventTrail = () => {
  eventTrail = [];
};

const composeException = (
  message: string | Event,
  source: string | undefined,
  lineno: number | undefined,
  colno: number | undefined,
  error: Error | undefined,
): Report => {
  const userInfo: UserInfo = getUserInfo(window.navigator.userAgent);

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
      ...(name && { errorName: name }),
      ...(stack && { stackTrace: stack }),
      ...(source && { source: source }),
      ...(lineno && { lineno: lineno }),
      ...(colno && { colno: colno }),
      ...configuration.additionalInfo,
    },
    ...(userInfo && { userInfo: userInfo }),
    trail: eventTrail,
  };
};
