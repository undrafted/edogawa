import { EventTrail } from '../types';
import { truncateString } from './helpers';

export const attachListeners = (cb: (ev: Event) => void) => {
  // lets just listen to click for now as its the most common
  document.documentElement.addEventListener('click', cb, true);
};

// TODO: maybe keep the event trail to a maximum length
export const eventTrailsCb = (eventTrail: EventTrail[], maxTrailSize: number = 15) => (
  ev: Event,
) => {
  const target = ev.target as Element;

  if (target) {
    eventTrail.push({
      id: target.id,
      class: target.className,
      tag: target.tagName,
      type: ev.type,
      partialInnerText: truncateString(target.innerHTML),
    });

    if (eventTrail.length > maxTrailSize) {
      eventTrail.shift();
    }
  }
};
