import React from 'react'

export default function createGroup (options, content) {
  const group = React.DOM.g(options, content)

  console.log('Created Group', options, content)

  return group
};
