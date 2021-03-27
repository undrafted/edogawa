import { EventTrail } from '../types';
import { truncateString } from './helpers';

// lets just listen to click and submit for now as they are the most common
const events = ['click', 'submit'];

export const attachListeners = (cb: (ev: Event) => void) => {
  if(self.document == null) {
    return;
  }
  for (let i = 0; i < events.length; i++) {
    self.document.documentElement.addEventListener(events[i], cb, true);
  }
};

export class EventTrailManager {
  static DEFAULT_MAX_TRAIL_SIZE = 15;
  private maxTrailSize: number = EventTrailManager.DEFAULT_MAX_TRAIL_SIZE;
  private eventTrail: EventTrail[] = [];

  constructor(maxTrailSize: number = EventTrailManager.DEFAULT_MAX_TRAIL_SIZE) {
    this.maxTrailSize = maxTrailSize;
  }

  callback = (ev: Event) => {
    const target = ev.target as Element;

    if (target) {
      this.eventTrail.push({
        id: target.id,
        class: target.className,
        tag: target.tagName,
        type: ev.type,
        partialInnerText: truncateString(target.innerHTML),
      });

      if (this.eventTrail.length > this.maxTrailSize) {
        this.eventTrail.shift();
      }
    }
  };

  getEventTrail = () => this.eventTrail;

  clearEventTrail = () => {
    this.eventTrail = [];
  };
}
