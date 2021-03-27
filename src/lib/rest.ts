import { Report } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 5000;
const THROTTLE_WAIT = 3000;

export class RestClient {
  endPoint: string;
  token: string | undefined;
  throttlingCalls = 0;

  constructor(endpoint: string, restToken?: string) {
    this.endPoint = endpoint;
    this.token = restToken;
  }

  // all reports are still pushed, but will be spreaded out if there is anything pending
  throttledPost(params: Report) {
    this.throttlingCalls += 1;
    setTimeout(() => {
      this.post(params);
      if (this.throttlingCalls > 0) {
        this.throttlingCalls -= 1;
      }
    }, this.throttlingCalls * THROTTLE_WAIT);
  }

  post(params: Report, tries: number = 1) {
    const fetch = self.fetch || fetchPolyfill;

    fetch(this.endPoint, {
      method: 'POST',
      body: JSON.stringify({
        ...(this.token && { token: this.token }),
        data: params,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((e) => {
      console.error('failed to push edogawa exception: ', e);
      if (tries < MAX_RETRIES) {
        setTimeout(() => {
          this.post(params, ++tries);
        }, tries * RETRY_DELAY_BASE);
      }
    });
  }
}

const fetchPolyfill = (url: string, options: RequestInit = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(options.method || 'GET', url);
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        // TS hack
        const header = (options.headers as { [key in string]: any })[h];
        xhr.setRequestHeader(header, header);
      });
    }

    xhr.onload = () => {
      resolve({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };

    xhr.onerror = (e) => reject(e);
    xhr.send(options.body);
  });
};
