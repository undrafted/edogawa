export class RestClient {
  endPoint: string;
  token: string | undefined;

  constructor(endpoint: string, restToken?: string) {
    this.endPoint = endpoint;
    this.token = restToken;
  }

  post(params: any) {
    try {
      fetch(this.endPoint, {
        method: 'POST',
        body: JSON.stringify({
          ...(this.token && { token: this.token }),
          data: params,
        }),
      });
    } catch (e) {
      console.log('failed to push edogawa exception: ', e);
    }
  }
}
