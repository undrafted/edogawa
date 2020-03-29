import { expect } from 'chai';
import { getUserInfo } from '../src/lib/user-info';

describe('getUserInfo', function() {
  const mockUser = {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    userInfo: {
      browser: { name: 'Chrome', version: '80.0.3987.149' },
      os: { name: 'macOS', version: '10.14.5', versionName: 'Mojave' },
      platform: { type: 'desktop', vendor: 'Apple' },
      engine: { name: 'Blink' },
    },
  };

  it('returns a correct userInfo', () => {
    expect(getUserInfo(mockUser.userAgent)).to.deep.equal(mockUser.userInfo);
  });

  it('returns a correct userInfo', () => {
    const emptyUserInfo = {
      browser: { name: '', version: '' },
      os: {},
      platform: {},
      engine: {},
    };

    expect(getUserInfo('nada')).to.deep.equal(emptyUserInfo);

    let undefinedUserAgent = (undefined as unknown) as string;
    expect(getUserInfo(undefinedUserAgent)).to.equal(undefined);
  });
});
