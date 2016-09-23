import React, { PropTypes } from 'react'

export default function NodeSublabelText(props) {
  return <text {...props}>{props.children}</text>
}

NodeSublabelText.propTypes = {
  children: PropTypes.node
}
