import {findDOMNode} from 'react-dom'

/* global CustomEvent */

// Show fake tooltip
// Class must have getTooltipTrigger (dom node) and shouldShowTooltip (boolean)
const Tooltip = {
  showTooltip: function (event) {
    if (!this.shouldShowTooltip()) { return }

    var tooltipEvent = new CustomEvent('the-graph-tooltip', {
      detail: {
        tooltip: this.props.label,
        x: event.clientX,
        y: event.clientY
      },
      bubbles: true
    })
    findDOMNode(this).dispatchEvent(tooltipEvent)
  },
  hideTooltip: function (/* event */) {
    if (!this.shouldShowTooltip()) { return }

    var tooltipEvent = new CustomEvent('the-graph-tooltip-hide', {
      bubbles: true
    })

    if (this.isMounted()) {
      findDOMNode(this).dispatchEvent(tooltipEvent)
    }
  },
  componentDidMount: function () {
    if (navigator && navigator.userAgent.indexOf('Firefox') !== -1) {
      // HACK Ff does native tooltips on svg elements
      return
    }

    const showTooltip = this.showTooltip.bind(this)
    const hideTooltip = this.hideTooltip.bind(this)

    var tooltipper = this.getTooltipTrigger()
    tooltipper.addEventListener('tap', showTooltip)
    tooltipper.addEventListener('mouseenter', showTooltip)
    tooltipper.addEventListener('mouseleave', hideTooltip)
  }
}

export default Tooltip
