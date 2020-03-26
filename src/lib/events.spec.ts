import { expect } from 'chai';
import sinon from 'sinon';
import { attachListeners, eventTrailsCb, DEFAULT_MAX_TRAIL_SIZE } from './events';
import { EventTrail } from '../types';

describe('attachListeners', function() {
  it('should call the callback', () => {
    const spyCb = sinon.spy();

    attachListeners(spyCb);
    document.documentElement.click();

    expect(spyCb.calledOnce).to.be.true;
    expect(spyCb.args[0][0] instanceof Event).to.be.true;
  });
});

describe('eventTrailsCb', function() {
  it('should add an event to the event trail', () => {
    const eventTrail: EventTrail[] = [];

    const cb = eventTrailsCb(eventTrail);

    const target = {
      id: '#mock-id',
      className: 'class-1 class-2',
      tagName: 'span',
      innerHTML: 'hello world',
    };

    const mockEvent = ({
      type: 'click',
      target,
    } as unknown) as Event;

    cb(mockEvent);

    expect(eventTrail.length).to.equal(1);
    expect(eventTrail[0]).to.deep.equal({
      id: target.id,
      class: target.className,
      tag: target.tagName,
      type: mockEvent.type,
      partialInnerText: target.innerHTML,
    });
  });

  it('should remove old events from the stack if maxTrailSize is reached', () => {
    const eventTrail: EventTrail[] = [];

    const cb = eventTrailsCb(eventTrail);

    const createTarget = (id: string): Element =>
      (({
        id,
        className: 'class-1 class-2',
        tagName: 'span',
        innerHTML: 'hello world',
      } as unknown) as Element);

    const mockEvent = (id: string) =>
      (({
        type: 'click',
        target: createTarget(id),
      } as unknown) as Event);

    const overflow = 5;
    for (let i = 0; i <= DEFAULT_MAX_TRAIL_SIZE + overflow; i++) {
      cb(mockEvent(`id-${i}`));
    }

    expect(eventTrail.length).to.equal(DEFAULT_MAX_TRAIL_SIZE);
    expect(eventTrail[0].id).to.equal(`id-${overflow + 1}`);
    expect(eventTrail[DEFAULT_MAX_TRAIL_SIZE - 1].id).to.equal(
      `id-${DEFAULT_MAX_TRAIL_SIZE + overflow}`,
    );
  });
});
