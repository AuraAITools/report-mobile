import { uuid } from "./utils";

export class AuthEventPublisher {
  private static _instance: AuthEventPublisher;
  private subscriptions: Map<string, Subscription>;
  // TODO: implement lock for publishing events
  // private lock: Lock;
  //TODO: implement auto refresh token ticker

  private constructor() {
    this.subscriptions = new Map();
  }

  public static getInstance(): AuthEventPublisher {
    if (!this._instance) {
      this._instance = new AuthEventPublisher();
      return this._instance;
    }
    return this._instance;
  }

  public subscribe(callback: AuthEventHandler) {
    const subscriptionId = uuid();

    const subscription: Subscription = {
      id: subscriptionId,
      callback: callback,
      unsubscribe: () => {
        this.subscriptions.delete(subscriptionId);
      },
    };

    this.subscriptions.set(subscriptionId, subscription);
    console.debug(
      `successfully subscribed a new eventHandler of id ${subscriptionId}`
    );
  }

  /**
   * Events are executed synchronously. i.e. SIGN_IN -> SIGN_OUT
   * SIGN_OUT event will wait for SIGN_IN to complete before executing
   * This is to prevent race conditions
   * However, the eventHandlers are executed asynchronously
   * @param event
   */
  public publishEvent(event: AuthEvent) {
    console.log(`publishing event ${event.toString()}`)
    // loop through all handlers and emit all of them
    this.subscriptions.forEach((subscription, key) => {
      console.log(`calling callback for event ${event.toString()}`);
      subscription.callback(event);
    });
  }
}

export type AuthEventHandler = (event: AuthEvent) => void;

export type Subscription = {
  id: string;
  callback: AuthEventHandler;
  unsubscribe: () => void;
};

// Auth events
export type AuthEvent = SIGNED_IN | SIGNED_OUT | SIGNED_UP | SESSION_REFRESHED;

export type SIGNED_IN = "SIGNED_IN";
export type SIGNED_OUT = "SIGNED_OUT";
export type SIGNED_UP = "SIGNED_UP";
export type SESSION_REFRESHED = "SESSION_REFRESHED";
