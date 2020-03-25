import { Config, AdditionalInfo, Report, EventTrail } from './types';
import { isValidUrl } from './lib/url';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, eventTrailsCb } from './lib/events';

let additionalInformation: AdditionalInfo = {};
let eventTrail: EventTrail[] = [];

export const init = (config: Config, additionalInfo: AdditionalInfo) => {
  const { endpoint } = config;
  if (!endpoint || !isValidUrl(endpoint)) {
    throw new Error('Invalid url is passed to Edogawa init');
  }

  additionalInformation = additionalInfo;

  // listen to usual interactive events
  attachListeners(eventTrailsCb(eventTrail));

  // listen for exceptions, hurray
  window.onerror = captureException;
};

/* https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
  message: error message (string). Available as event (sic!) in HTML onerror="" handler.
  source: URL of the script where the error was raised (string)
  lineno: Line number where error was raised (number)
  colno: Column number for the line where the error occurred (number)
  error: Error Object (object) */
const captureException: OnErrorEventHandler = (message, source, lineno, colno, error) => {
  const report = composeException(message, source, lineno, colno, error);
  // clean slate
  eventTrail = [];

  // TODO: post report obj to service
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
