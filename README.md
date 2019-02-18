# WebMo

Small (~1.6KB gzipped) library to capture device motion and orientation events. 

## Usage

```ts
import * as webmo from 'webmo'

// Assuming top-level async/await is available
const hasMotionSupport = await webmo.motion.deviceHasMotionSupport()

if (hasMotionSupport) {
  const mListener = new webmo.motion.MotionListener(data => {
    console.log('Received motion payload: ', data)
  })
}

const hasOrientationSupport = await webmo.orientation.deviceHasOrientationSupport()

if (hasOrientationSupport) {
  const oListener = new webmo.orientation.OrientationListener(data => {
    console.log('Received orientation payload: ', data)
  })
}
```

## Behaviours

This library normalises device alpha orientation, i.e the position the phone is in when the first
orientation event is captured is used as alpha of 0. This is only necessary on Android devices, iOS devices default to 0 as the initial alpha heading.

Behaviour like this can be made configurable through options in the future.

## API

### webmo.motion

All motion related functions fall under this namespace.

### webmo.motion.mayHaveMotionSupport()

Returns `true` if `DeviceMotionEvent` is available.

### webmo.motion.deviceHasMotionSupport(timeout: number): Promise<boolean>

Tests for motion support by detecting motion events. Defaults to a 1000 millisecond timeout before resolving with `false`. Resolves with `true` if a motion event is detected before `timeout` is reached.

### webmo.motion.MotionListener(callback, options)

A class that can be instantiated to listen for motion events. Accepts two arguments:

* callback - Callback that receives sensor data
* options - Object containing configuration

Valid options are:

* threshold (Default: 0) - Threshold required to register motion. Can be used to filter out smaller motions.
* autoStart (Default: true) - If motion events should be listened for immediately.

Callback and data format:

```ts
const listener = new webmo.MotionListener((data) => {
  // data is an object like so:
  // {
  //   acceleration: {
  //     x: number
  //     y: number
  //     z: number
  //   }
  //   timestamp: number
  // }
})
```

#### webmo.motion.MotionListener.start()

Start listening for motion events. Only required if `options.autoStart` was set to false.

#### webmo.motion.MotionListener.stop()

Stop listening for motion events.

#### webmo.motion.MotionListener.setThreshold(n: number)

Changes the threshold required for this instance to consider a motion event worth emitting.

#### webmo.motion.MotionListener.isListening()

Returns `true` if the instance is listening for motion events.

### webmo.orientation

The orientation API is the same as `webmo.motion`, but data objects have the following structure:

```ts
const listener = new webmo.MotionListener((data) => {
  // data is an object like so:
  // {
  //   alpha: number
  //   beta: number
  //   gamma: number
  //   timestamp: number
  // }
})
```
