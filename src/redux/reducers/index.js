import { combineReducers } from 'redux'

import app from './app.js';
import graph from './graph.js';

export default combineReducers({
  app,
  graph
})
