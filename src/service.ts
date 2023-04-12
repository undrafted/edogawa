import { Config, Report, UserInfo, DevConfig } from './types';
import { isSriptError, SCRIPT_ERROR_MESSAGE } from './lib/dom';
import { attachListeners, EventTrailManager } from './lib/events';
import { RestClient } from './lib/rest';
import { getUserInfo } from './lib/user-info';
import { noop } from './lib/utils';

export class Reporter {
  private restClient: RestClient;
  private exceptionCb: (report: Report) => void = noop;
  private evTrail: EventTrailManager;
  private configuration: Config = { ignore: [], additionalInfo: {}, endpoint: '' };
  private devConfiguration: DevConfig = { clientSideDebug: false };

  constructor(config: Config, exceptionCallback?: (report: Report) => void, devConfig?: DevConfig) {
    const { endpoint, restToken, maxTrailSize, ignore = [], additionalInfo = {} } = config;

    if (!endpoint) {
      throw new Error(`Invalid url is passed to Edogawa init: ${endpoint}`);
    }

    this.configuration = {
      ignore,
      additionalInfo,
      endpoint,
      maxTrailSize,
    };

    // create restClient
    this.restClient = new RestClient(endpoint, restToken);

    if (exceptionCallback) {
      this.exceptionCb = exceptionCallback;
    }

    if (devConfig) {
      this.devConfiguration = devConfig;
    }

    this.evTrail = new EventTrailManager(config.maxTrailSize);

    // listen to usual interactive events
    attachListeners(this.evTrail.callback);

    self.addEventListener('error', this.captureException);
  }

  captureException = ({ message, filename, lineno, colno, error }: ErrorEvent) => {
    //dont do anything if its in ignore list
    if (
      this.configuration.ignore &&
      this.configuration.ignore.some((regexp) => regexp.test(message.toString()))
    ) {
      return;
    }

    const report = this.composeException(message, filename, lineno, colno, error);

    // clean slate
    this.evTrail.clearEventTrail();

    if (!this.devConfiguration.clientSideDebug) {
      // push to endpoint
      this.restClient.throttledPost(report);
    }

    if (this.exceptionCb) {
      this.exceptionCb(report);
    }
  };

  private composeException = (
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
        ...this.configuration.additionalInfo,
      },
      ...(userInfo && { userInfo: userInfo }),
      trail: this.evTrail.getEventTrail(),
    };
  };
}
