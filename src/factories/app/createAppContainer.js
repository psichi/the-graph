import React from 'react'

// No need to promote DIV creation to TheGraph.js.
export default function createAppContainer(options, content) {
  return React.DOM.div(options, content);
}
