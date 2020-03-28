import { Config, AdditionalInfo, Report, EventTrail } from './types';
import { isValidUrl } from './lib/url';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, eventTrailsCb } from './lib/events';
import { RestClient } from './lib/rest';

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
  eventTrail = [];
  // push to endpoint
  restClient.post(report);
};

const composeException = (
  message: string | Event,
  source: string | undefined,
  lineno: number | undefined,
  colno: number | undefined,
  error: Error | undefined,
): Report => {
  // add user browser info

  if (isSriptError(message.toString())) {
    return {
      exception: {
        message: SCRIPT_ERROR_MESSAGE,
      },
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
    trail: eventTrail,
  };
};
