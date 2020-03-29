import { expect } from 'chai';
import sinon from 'sinon';
import { attachListeners, EventTrailManager } from './events';

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
    const evTrail = new EventTrailManager();

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

    evTrail.callback(mockEvent);

    expect(evTrail.getEventTrail().length).to.equal(1);
    expect(evTrail.getEventTrail()[0]).to.deep.equal({
      id: target.id,
      class: target.className,
      tag: target.tagName,
      type: mockEvent.type,
      partialInnerText: target.innerHTML,
    });
  });

  it('should remove old events from the stack if maxTrailSize is reached', () => {
    const evTrail = new EventTrailManager();

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
    for (let i = 0; i <= EventTrailManager.DEFAULT_MAX_TRAIL_SIZE + overflow; i++) {
      evTrail.callback(mockEvent(`id-${i}`));
    }

    expect(evTrail.getEventTrail().length).to.equal(EventTrailManager.DEFAULT_MAX_TRAIL_SIZE);
    expect(evTrail.getEventTrail()[0].id).to.equal(`id-${overflow + 1}`);
    expect(evTrail.getEventTrail()[EventTrailManager.DEFAULT_MAX_TRAIL_SIZE - 1].id).to.equal(
      `id-${EventTrailManager.DEFAULT_MAX_TRAIL_SIZE + overflow}`,
    );

    const trailSize = 25;
    const evTrail2 = new EventTrailManager(trailSize);
    for (let i = 0; i <= trailSize + overflow; i++) {
      evTrail2.callback(mockEvent(`id-${i}`));
    }

    expect(evTrail2.getEventTrail().length).to.equal(trailSize);
    expect(evTrail2.getEventTrail()[0].id).to.equal(`id-${overflow + 1}`);
    expect(evTrail2.getEventTrail()[trailSize - 1].id).to.equal(`id-${trailSize + overflow}`);
  });
});
