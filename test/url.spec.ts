import { expect } from 'chai';
import { isValidUrl } from '../src/lib/url';

describe('isValidUrl', function() {
  it('returns true on valid urls', () => {
    expect(isValidUrl('https://google.com')).to.be.true;
    expect(isValidUrl('http://google.com')).to.be.true;
    expect(isValidUrl('www.google.com')).to.be.true;
    expect(isValidUrl('google.com')).to.be.true;
    expect(isValidUrl('google.com/abc&test=123')).to.be.true;
  });

  it('returns false on invalid urls', () => {
    expect(isValidUrl('https//google.com')).to.be.false;
    expect(isValidUrl('http://googlecom')).to.be.false;
    expect(isValidUrl('google')).to.be.false;
    expect(isValidUrl('//abcs')).to.be.false;
  });
});
