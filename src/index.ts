import { Config, AdditionalInfo, Report, EventTrail, UserInfo } from './types';
import { isValidUrl } from './lib/url';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, eventTrailsCb } from './lib/events';
import { RestClient } from './lib/rest';
import { getUserInfo } from './lib/user-info';

let additionalInformation: AdditionalInfo = {};
let eventTrail: EventTrail[] = [];
let restClient: RestClient;

export const init = (config: Config, additionalInfo?: AdditionalInfo) => {
  const { endpoint, restToken, maxTrailSize } = config;
  if (!endpoint || !isValidUrl(endpoint)) {
    throw new Error(`Invalid url is passed to Edogawa init: ${endpoint}`);
  }

  // create restClient
  restClient = new RestClient(endpoint, restToken);

  if (additionalInfo) {
    // for when we create the report
    additionalInformation = additionalInfo;
  }

  // listen to usual interactive events
  attachListeners(eventTrailsCb(eventTrail, maxTrailSize));

  /* listen for exceptions, hurray
   https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror */
  window.onerror = captureException;
};

const captureException: OnErrorEventHandler = (message, source, lineno, colno, error) => {
  const report = composeException(message, source, lineno, colno, error);
  // clean slate
  clearEventTrail();
  // push to endpoint
  restClient.post(report);
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
      ...additionalInformation,
    },
    ...(userInfo && { userInfo: userInfo }),
    trail: eventTrail,
  };
};
