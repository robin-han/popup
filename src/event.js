
class Event {
  constructor() {
    this._events = [];
  }

  on(element, type, fn, data, context) {
    if (!element || typeof type !== 'string' || typeof fn !== 'function') {
      return;
    }

    let elementEvent = this._getElementEvent(element);
    if (!elementEvent) {
      elementEvent = { element, events: {} };
      this._events.push(elementEvent);
    }

    let evts = elementEvent.events[type];
    if (!evts) {
      evts = [];
      elementEvent.events[type] = evts;
    }

    const handler = this._createEventHandler(fn, data, context);
    evts.push({ fn: handler, data, context });
    element.addEventListener(type, handler, false);
  }

  off(element, type) {
    if (element && type) { //
      const elementEvent = this._getElementEvent(element);
      const eventDatas = (elementEvent && elementEvent.events[type]) || [];
      eventDatas.forEach((evtData) => {
        element.removeEventListener(type, evtData.fn, false);
      });
      if (eventDatas.length > 0) {
        elementEvent.events[type] = [];
        const eventTypes = Object.keys(elementEvent.events);
        if (eventTypes.length === 0 || (eventTypes.length === 1 && elementEvent.events[eventTypes[0]].length === 0)) {
          const index = this._events.indexOf(elementEvent);
          if (index >= 0) {
            this._events.splice(index, 1);
          }
        }
      }
    } else if (element) { //
      const elementEvent = this._getElementEvent(element);
      const all = (elementEvent && elementEvent.events) || {};
      const keys = Object.keys(all);
      keys.forEach((key) => {
        const eventDatas = all[key];
        eventDatas.forEach((evtData) => {
          element.removeEventListener(type, evtData.fn, false);
        });
      });
      const index = this._events.indexOf(elementEvent);
      if (index >= 0) {
        this._events.splice(index, 1);
      }
    } else if (type) { //
      this._events.slice(0).forEach((elementEvent) => {
        const elem = elementEvent.element;
        const all = elementEvent.events;
        const keys = Object.keys(all);
        keys.forEach((key) => {
          if (key === type) {
            const eventDatas = all[key];
            eventDatas.forEach((evtData) => {
              elem.removeEventListener(type, evtData.fn, false);
            });
            elementEvent.events[key] = [];
            const eventTypes = Object.keys(elementEvent.events);
            if (eventTypes.length === 0 || (eventTypes.length === 1 && elementEvent.events[eventTypes[0]].length === 0)) {
              const index = this._events.indexOf(elementEvent);
              if (index >= 0) {
                this._events.splice(index, 1);
              }
            }
          }
        });
      });
    } else { //
      this._events.forEach((elementEvent) => {
        const elem = elementEvent.element;
        const all = elementEvent.events;
        const keys = Object.keys(all);
        keys.forEach((key) => {
          const eventDatas = all[key];
          eventDatas.forEach((evtData) => {
            elem.removeEventListener(type, evtData.fn, false);
          });
        });
      });
      this._events = [];
    }
  }

  _getElementEvent(element) {
    const events = this._events;
    for (let i = 0, count = events.length; i < count; i++) {
      if (events[i].element === element) {
        return events[i];
      }
    }
    return null;
  }

  _createEventHandler(fn, data, context) {
    return function (evt) {
      evt.data = data;
      fn.apply(context, [evt]);
    };
  }
}

export default Event;
