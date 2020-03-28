import * as Bowser from 'bowser';

export const getUserInfo = (userAgent: string) => {
  if (!userAgent) {
    return undefined;
  }

  return Bowser.parse(userAgent);
};
