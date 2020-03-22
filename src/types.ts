export interface Config {
  endpoint: string;
}

export type Report = {
  exception: {
    name?: string;
    stackTrace?: string;
    message?: string;
    source?: string;
    lineno?: number;
    colno?: number;
  };
};

export type AdditionalInfo = {
  [key in string]: any;
};
