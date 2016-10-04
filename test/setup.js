import jsdom from 'jsdom'
import { expect } from 'chai'

global.__DEV__ = false;

// Existence of Proxy triggers illegal access in Synthetic Event while debugging
global.Proxy = false

if (typeof document === 'undefined') {
  global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
  global.window = document.defaultView
  global.navigator = global.window.navigator
  global.expect = expect
}
