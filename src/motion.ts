import { AbstractListener } from "./abstract-listener";

const EVT_NAME = 'devicemotion'

/**
 * Determies if DeviceMotionEvent is available for use.
 * This does not indicate that the device actually supports motion.
 */
export function mayHaveMotionSupport () {
  return typeof DeviceMotionEvent !== 'undefined'
}

/**
 * Determines if motion support is available by listening for a motion event.
 * Waits up to 500 milliseconds for an event by default, but can be extended.
 * @param timeout Time to wait before deciding motion support is unavailable.
 */
export function deviceHasMotionSupport (timeout = 1000) {
  return new Promise((resolve) => {
    const listener = (e: DeviceMotionEvent) => {
      window.removeEventListener(EVT_NAME, listener)
      if (e.acceleration) {
        resolve(true)
      } else {
        resolve(false)
      }
    }

    window.addEventListener(EVT_NAME, listener)

    setTimeout(() => resolve(false), timeout)
  })
}

export interface MotionListenerEvent {
  acceleration: {
    x: number
    y: number
    z: number
  }
  timestamp: number
}

export class MotionListener extends AbstractListener <MotionListenerEvent, DeviceMotionEvent> {
  protected eventName = EVT_NAME

  isChangeAboveThreshold (e: DeviceMotionEvent) {
    if (!e.acceleration || typeof e.acceleration.x !== 'number' || typeof e.acceleration.y !== 'number' || typeof e.acceleration.z !== 'number') {
      return false
    } else if (this.options.threshold) {
      const { x, y, z } = e.acceleration
      return Math.abs(x) > this.options.threshold || Math.abs(y) > this.options.threshold || Math.abs(z) > this.options.threshold
    } else {
      return true
    }
  }

  onChangeEvent (e: DeviceMotionEvent) {
    if (!e.acceleration || typeof e.acceleration.x !== 'number' || typeof e.acceleration.y !== 'number' || typeof e.acceleration.z !== 'number') {
      throw new Error('The "acceleration" property was missing from DeviceMotionEvent. This library only works on devices that fully support this event.')
    } else if (this.isChangeAboveThreshold(e)) {
      this.listener({
        acceleration: {
          x: e.acceleration.x,
          y: e.acceleration.y,
          z: e.acceleration.z
        },
        timestamp: Date.now()
      })
    }
  }
}
