export interface Config {
  endpoint: string;
}

export type Exception = {
  message: string;
  source: string;
  lineno: number;
  colno: number;
  error: Error;
};

export type AdditionalInfo = {
  [key in string]: any;
};
