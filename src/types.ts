export interface Config {
  endpoint: string;
  restToken?: string;
  maxTrailSize?: number;
  ignore?: RegExp[];
  additionalInfo?: {
    [key in string]: any;
  };
}

export interface DevConfig {
  clientSideDebug?: boolean;
}

export type UserInfo = Bowser.Parser.ParsedResult | undefined;

export type Report = {
  exception: {
    name?: string;
    stackTrace?: string;
    message?: string;
    source?: string;
    lineno?: number;
    colno?: number;
  };
  userInfo?: UserInfo;
  trail?: EventTrail[];
};

export interface EventTrail {
  tag: string;
  id: string;
  class: string;
  type: string;
  partialInnerText: string;
}
