export interface Config {
  endpoint: string;
  restToken?: string;
  maxTrailSize?: number;
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
  trail?: EventTrail[];
};

export type AdditionalInfo = {
  [key in string]: any;
};

export interface EventTrail {
  tag: string;
  id: string;
  class: string;
  type: string;
  partialInnerText: string;
}
