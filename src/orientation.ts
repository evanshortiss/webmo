import { AbstractListener } from './abstract-listener';

const EVT_NAME = 'deviceorientation';

/**
 * Determies if DeviceOrientationEvent is available for use.
 * This does not indicate that the device actually supports motion.
 */
export function mayHaveOrientationSupport() {
  return typeof DeviceOrientationEvent !== 'undefined';
}

/**
 * Determines if motion support is available by listening for a motion event.
 * Waits up to 500 milliseconds for an event by default, but can be extended.
 * @param timeout Time to wait before deciding motion support is unavailable.
 */
export function deviceHasOrientationSupport(timeout = 1000) {
  return new Promise(resolve => {
    const listener = (e: DeviceOrientationEventInit) => {
      window.removeEventListener(EVT_NAME, listener);
      resolve(true);
    };

    window.addEventListener(EVT_NAME, listener);

    setTimeout(() => resolve(false), timeout);
  });
}

export interface OrientationListenerEvent {
  alpha: number;
  beta: number;
  gamma: number;
  absolute?: boolean;
  timestamp: number;
}

export class OrientationListener extends AbstractListener<
  OrientationListenerEvent,
  DeviceOrientationEvent
> {
  isAndroidDevice = navigator.userAgent.match(/android/gi) !== null;
  initialEvent: DeviceOrientationEvent | undefined = undefined;
  eventName = EVT_NAME;

  private getAlpha(alpha: number): number {
    if (this.isAndroidDevice && this.initialEvent && this.initialEvent.alpha) {
      let a = alpha - this.initialEvent.alpha;

      if (a < 0) {
        a += 360;
      }

      return a;
    } else {
      return alpha;
    }
  }

  isChangeAboveThreshold(data: OrientationListenerEvent): boolean {
    const previous = this._previousEvent;

    if (!previous) {
      return true;
    } else if (this.options.threshold) {
      const { alpha, beta, gamma } = data;
      return (
        Math.abs(alpha - previous.alpha) > this.options.threshold ||
        Math.abs(beta - previous.beta) > this.options.threshold ||
        Math.abs(gamma - previous.gamma) > this.options.threshold
      );
    } else {
      return true;
    }
  }

  formatEvent(e: DeviceOrientationEvent) {
    if (!this._previousEvent) {
      // Kind of nasty hack. Whatever...
      this.initialEvent = e;
    }

    if (
      typeof e.alpha !== 'number' ||
      typeof e.beta !== 'number' ||
      typeof e.gamma !== 'number'
    ) {
      throw new Error(
        'The alpha, beta, or gamma property was missing from DeviceOrientationEvent. This library only works on devices that fully support this event.'
      );
    } else {
      return {
        alpha: this.getAlpha(e.alpha),
        beta: e.beta,
        gamma: e.gamma,
        timestamp: Date.now()
      };
    }
  }
}
