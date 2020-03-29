import { expect } from 'chai';
import { isSriptError } from '../src/lib/dom';

describe('isSriptError', function() {
  it('should return true for script errors', () => {
    expect(isSriptError('Example Script Error')).to.be.true;
  });
  it('should return false for non script errors', () => {
    expect(isSriptError('Type error at line...')).to.be.false;
  });
});
