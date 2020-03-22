import { Config, AdditionalInfo, Exception } from './types';
import { isValidUrl } from './lib/url';

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
  // TODO: implementation
};

const captureDomEventTrails = () => {
  // TODO: implementation
  // bind all interactive listeners
  // each callback adds an event to the eventStack
  // keep eventStack size small -  configurable in init(?)
};

const composeException = (exception: Exception, additionalInfo: AdditionalInfo) => {
  // TODO: implementation
};
