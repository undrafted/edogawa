import { expect } from 'chai';
import { truncateString } from './helpers';

describe('truncateString', function() {
  it('truncate long string', () => {
    const lorem =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    expect(truncateString(lorem)).to.equal('Lorem ipsum dolor sit amet, consect...');
    expect(truncateString(lorem, 50)).to.equal(
      'Lorem ipsum dolor sit amet, consectetur adipiscing...',
    );
  });

  it('doesnt append ... to short string', () => {
    expect(truncateString('hello world')).to.equal('hello world');
  });
});
