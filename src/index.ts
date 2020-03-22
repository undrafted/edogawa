import { Config, AdditionalInfo, Report } from './types';
import { isValidUrl } from './lib/url';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';

let configuration: Config;
let additionalInformation: AdditionalInfo = {};
let eventStack: Event[] = [];

export const init = (config: Config, additionalInfo: AdditionalInfo) => {
  const { endpoint } = config;
  if (!endpoint || !isValidUrl(endpoint)) {
    throw new Error('Invalid url is passed to Edogawa init');
  }

  configuration = config;
  additionalInformation = additionalInfo;
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

  // TODO: post report obj to service
};

const captureDomEventTrails = () => {
  // TODO: implementation
  // bind all interactive listeners
  // each callback adds an event to the eventStack
  // keep eventStack size small -  configurable in init(?)
};

const composeException = (
  message: string | Event,
  source: string | undefined,
  lineno: number | undefined,
  colno: number | undefined,
  error: Error | undefined,
): Report => {
  // TODO: add event stack []
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
  };
};
