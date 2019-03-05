# CHANGELOG

## 05/03/19 - 0.3.0

* Add `setListener` function instances

## 19/02/19 - 0.2.0

### Public API Changes
* Add `getLastCapturedEvent` method to listeners
* Make `listener` argument optional for constructors
* Export `ListenerOptions` interface

### Internal Changes
* Add `formatEvent()` method to `AbstractListener`
* Add `fireEvent()` method to `AbstractListener`
* Implement `onChangeEvent()` method in `AbstractListener`
