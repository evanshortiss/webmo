import { AbstractListener } from './abstract-listener';

const EVT_NAME = 'devicemotion';

/**
 * Determies if DeviceMotionEvent is available for use.
 * This does not indicate that the device actually supports motion.
 */
export function mayHaveMotionSupport() {
  return typeof DeviceMotionEvent !== 'undefined';
}

/**
 * Determines if motion support is available by listening for a motion event.
 * Waits up to 500 milliseconds for an event by default, but can be extended.
 * @param timeout Time to wait before deciding motion support is unavailable.
 */
export function deviceHasMotionSupport(timeout = 1000) {
  return new Promise(resolve => {
    const listener = (e: DeviceMotionEvent) => {
      window.removeEventListener(EVT_NAME, listener);
      if (e.acceleration) {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    window.addEventListener(EVT_NAME, listener);

    setTimeout(() => resolve(false), timeout);
  });
}

export interface MotionListenerEvent {
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: number;
}

export interface VerifiedMotionEvent extends DeviceMotionEvent {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export class MotionListener extends AbstractListener<
  MotionListenerEvent,
  DeviceMotionEvent,
  VerifiedMotionEvent
> {
  protected eventName = EVT_NAME;

  verifyEventStructure(e: DeviceMotionEvent) {
    if (
      e.acceleration &&
      e.acceleration.x &&
      e.acceleration.y &&
      e.acceleration.z &&
      e.rotationRate &&
      e.rotationRate.alpha &&
      e.rotationRate.beta &&
      e.rotationRate.gamma
    ) {
      return e as VerifiedMotionEvent;
    } else {
      throw new Error(
        'The "acceleration" or "rotationRate" property in DeviceMotionEvent appears to be malformed. This library only works on devices that fully support this event.'
      );
    }
  }

  private isAboveThreshold(e: VerifiedMotionEvent) {
    if (this.options.threshold) {
      const { x, y, z } = e.acceleration;

      return (
        Math.abs(x) > this.options.threshold ||
        Math.abs(y) > this.options.threshold ||
        Math.abs(z) > this.options.threshold
      );
    } else {
      return true;
    }
  }

  private isAboveRotationRateThreshold(e: VerifiedMotionEvent) {
    if (this.options.rotationRateThreshold) {
      const { alpha, beta, gamma } = e.rotationRate;

      return (
        Math.abs(alpha) > this.options.rotationRateThreshold ||
        Math.abs(beta) > this.options.rotationRateThreshold ||
        Math.abs(gamma) > this.options.rotationRateThreshold
      );
    } else {
      return true;
    }
  }

  isChangeAboveThreshold(e: VerifiedMotionEvent) {
    return this.isAboveThreshold(e) || this.isAboveRotationRateThreshold(e);
  }

  formatEvent(e: VerifiedMotionEvent) {
    return {
      rotationRate: e.rotationRate,
      acceleration: e.acceleration,
      timestamp: Date.now()
    };
  }
}
