const api = {
  keyup: {
    listeners: [],
    handler: function keyUp(event) {
      api.keyup.listeners.forEach((listener) => {
        listener(event)
      })
    }
  },
  keydown: {
    listeners: [],
    handler: function keyDown(event) {
      api.keydown.listeners.forEach((listener) => {
        listener(event)
      })
    }
  }
}

/**
 * Subscribes to key events on the document.
 *
 * Usage:
 *
 *   function keyHandler (event) {}
 *
 *   keys.subscribe('keydown', keyHandler)
 *   keys.unsubscribe('keyup', keyHandler)
 *
 * @param type
 * @param callback
 * @returns {function()}
 */
export default {
  subscribe(type, callback) {
    if (api[type].listeners.length === 0) {
      document.addEventListener(type, api[type].handler)
    }

    api[type].listeners.push(callback)
  },
  unsubscribe(type, callback) {
    const index = api[type].listeners.indexOf(callback)

    api[type].listeners.splice(index, 1)

    if (api[type].listeners.length = 0) {
      document.removeEventListener(type, api[type].handler)
    }
  }
}
