# CHANGELOG

## 19/02/19

### Public API Changes
* Add `getLastCapturedEvent` method to listeners
* Make `listener` argument optional for constructors
* Export `ListenerOptions` interface

### Internal Changes
* Add `formatEvent()` method to `AbstractListener`
* Add `fireEvent()` method to `AbstractListener`
* Implement `onChangeEvent()` method in `AbstractListener`
