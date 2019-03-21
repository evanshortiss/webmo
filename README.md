# WebMo
[![Bundle size](https://img.shields.io/bundlephobia/minzip/webmo.svg)](https://bundlephobia.com/result?p=webmo)
[![npm version](https://badge.fury.io/js/webmo.svg)](https://www.npmjs.com/package/webmo)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](http://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/webmo.svg)](https://github.com/evanshortiss/webmo/blob/master/package.json)

A tiny library to capture device motion, rotation, and orientation events.

## Usage

```ts
import * as webmo from 'webmo'

async function startCapture () {
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
}

startCapture()
```

## Behaviours

Behaviour like this can be made configurable through options in the future.

### Alpha Orientation Value
This library normalises device alpha orientation, i.e the position the phone is in when the first
orientation event is captured is used as alpha of 0. This is only necessary on Android devices, iOS devices default to 0 as the initial alpha heading.

### Device Support Tests
The `orientation.deviceHasOrientationSupport` and `motion.deviceHasMotionSupport` functions are designed to detect a motion event. If none is detected then you might get a false negative, e.g user left their phone lying on a table so no motion change is detected. Make sure you account for this in your application, by telling the user to "hold the device in their hand" or similar.


## Example

To try the example application do the following:

```
git clone https://github.com/evanshortiss/webmo.git
cd webmo
npm i
npm start
```

Now visit port 8080 using a device that supports motion and orientation, for example a modern iOS or Android phone, and you'll see live data from the sensors.

## API

### webmo.motion

All motion related functions fall under this namespace.

### webmo.motion.mayHaveMotionSupport(): boolean

Returns `true` if `DeviceMotionEvent` is defined globally.

### webmo.motion.deviceHasMotionSupport(timeout: number): Promise\<boolean>

Tests for motion support by detecting motion events. Defaults to a 1000 millisecond timeout before resolving with `false`. Resolves with `true` if a motion event is detected before `timeout` is reached.

### webmo.motion.MotionListener(callback, options)

A class that can be instantiated to listen for motion events. Accepts two arguments:

* callback - Callback that receives sensor data
* options - Object containing configuration

Valid options are:

* threshold (Default: 0) - Threshold required to register motion. Can be used to filter out smaller motions.
* rotationRateThreshold (Default: 0) - Threshold required to fire an event for rotation rate. Can be used to filter out smaller/sloewr rotations.
* autoStart (Default: true) - If motion events should be listened for immediately.

Callback and data format:

```ts
const options = {
  threshold: 5
}
const listener = new webmo.MotionListener((data) => {
  // data is an object like so:
  // {
  //   acceleration: {
  //     x: number
  //     y: number
  //     z: number
  //   }
  //   rotationRate: {
  //     alpha: number
  //     beta: number
  //     gamma: number
  //   }
  //   timestamp: number
  // }
}, options)
```

#### webmo.motion.MotionListener.start()

Start listening for motion events. Only required if `options.autoStart` was set to false.

#### webmo.motion.MotionListener.stop()

Stop listening for motion events.

#### webmo.motion.MotionListener.setListener(callback: function|undefined) 

Replace the listener function that was passed to the instance constructor.

#### webmo.motion.MotionListener.setThreshold(n: number)

Changes the threshold required for this instance to consider a motion or rotation event event worth emitting.

#### webmo.motion.MotionListener.isListening(): boolean

Returns `true` if the instance has bound event handlers for motion.

### webmo.orientation

The orientation API is the same as `webmo.motion`, but returned data objects have the following structure:

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
