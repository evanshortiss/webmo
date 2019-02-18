export interface ListenerOptions {
  threshold?: number;
  autoStart?: boolean;
}

export abstract class AbstractListener<WrappedDomEvent, BaseEvent> {
  protected eventName = '';
  protected _previousEvent: WrappedDomEvent | undefined;
  private _internalListener = (e: any) => this.onChangeEvent(e);
  private _listening = false;

  constructor(
    protected listener: (data: WrappedDomEvent) => void,
    protected options: ListenerOptions = {}
  ) {
    this.options = Object.assign({ autoStart: true }, options);

    if (this.options.autoStart) {
      setTimeout(() => this.start());
    }
  }

  /**
   * Start listening for motion events.
   */
  public start() {
    if (!this._listening) {
      // Prevent adding same listener multiple times...
      window.addEventListener(this.eventName, this._internalListener);
      this._listening = true;
    }
  }

  /**
   * Stop listening for motion events.
   */
  public stop() {
    window.removeEventListener(this.eventName, this._internalListener);
    this._listening = false;
  }

  /**
   * Change the threshold required to record a motion event.
   * Any motion that registers below this value on all axes is ignored.
   * @param threshold
   */
  public setThreshold(threshold: number) {
    this.options.threshold = threshold;
  }

  /**
   * Returns the status of this listener.
   */
  public isListening() {
    return this._listening;
  }

  /**
   * Determines if the reported event is great enough to warrant
   * attention based on the defined threshold.
   * @param e
   */
  protected abstract isChangeAboveThreshold(
    data: WrappedDomEvent | BaseEvent
  ): boolean;

  /**
   * Internal function used to determine if the orientation callback will be
   * fired.
   * @param e
   */
  protected abstract onChangeEvent(e: BaseEvent): void;
}
