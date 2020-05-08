export class RestClient {
  endPoint: string;
  token: string | undefined;

  constructor(endpoint: string, restToken?: string) {
    this.endPoint = endpoint;
    this.token = restToken;
  }

  post(params: any) {
    let tries = 1;
    const RETRY_DELAY = 5000;

    try {
      const fetch = window.fetch || fetchPolyfill;

      fetch(this.endPoint, {
        method: 'POST',
        body: JSON.stringify({
          ...(this.token && { token: this.token }),
          data: params,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.log('failed to push edogawa exception: ', e);
      if (tries < 3) {
        tries++;
        setTimeout(() => {}, tries * RETRY_DELAY);
      }
    }
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
