const toString = Object.prototype.toString;
const isType = obj => toString.call(obj).slice(8, -1).toLowerCase();
const isArray = obj => Array.isArray(obj) || isType(obj) === 'array';
const isNullOrUndefined = obj => obj === null || obj === undefined;

const errorHanler = (value, message) => {
  this.value = value;
  this.message = message;

  this.toString = () => `${this.value}${this.message}`;
};

const _addListener = function(type, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  fn.context = context;
  fn.once = !!once;

  const event = this._events[type];
  // only one, let `this._events[type]` to be a function
  if (isNullOrUndefined(event)) {
    this._events[type] = fn;
  } else if (typeof event === 'function') {
    // already has one function, `this._events[type]` must be a function before
    this._events[type] = [event, fn];
  } else if (isArray(event)) {
    // already has more than one function, just push
    this._events[type].push(fn);
  }

  return this;
};

class EventEmitter {
  constructor() {
    if (this._events === undefined) {
      this._events = Object.create(null);
    }
  }

  addListener(type, fn, context) {
    return _addListener.call(this, type, fn, context);
  }

  on(type, fn, context) {
    return this.addListener(type, fn, context);
  }

  once(type, fn, context) {
    return _addListener.call(this, type, fn, context, true);
  }

  emit(type, ...rest) {
    if (isNullOrUndefined(type)) {
      throw new Error('emit must receive at lease one argument');
    }

    const event = this._events[type];
    if (isNullOrUndefined(event)) {
      throw new Error('emit function must not be null or undefined');
    }

    if (typeof event === 'function') {
      event.call(event.context || null, rest);
      if (event.once) {
        // TODO: remove this event
      }
    } else if (isArray(event)) {
      event.map(e => e.call(e.context || null, rest));
    }

    return true;
  }
}


export default EventEmitter;

