export class RestClient {
  endPoint: string;
  token: string | undefined;

  constructor(endpoint: string, restToken?: string) {
    this.endPoint = endpoint;
    this.token = restToken;
  }

  post(params: any) {
    try {
      const fetch = window.fetch || fetchPolyfill;

      fetch(this.endPoint, {
        method: 'POST',
        body: JSON.stringify({
          ...(this.token && { token: this.token }),
          data: params,
        }),
      });
    } catch (e) {
      console.log('Failed to push edogawa exception: ', e);
    }
  }
}

const fetchPolyfill = (url: string, options: RequestInit = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(options.method || 'GET', url);
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
