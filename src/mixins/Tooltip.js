import { findDOMNode } from 'react-dom'

/* global CustomEvent */

// Show fake tooltip
// Class must have getTooltipTrigger (dom node) and shouldShowTooltip (boolean)
const Tooltip = {
  showTooltip(event) {
    if (!this.shouldShowTooltip()) { return }

    const domNode = findDOMNode(this)
    const { label: tooltip } = this.props
    const { clientX: x, clientY: y } = event

    const tooltipEvent = new CustomEvent('the-graph-tooltip', {
      detail: { tooltip, x, y },
      bubbles: true
    })

    domNode.dispatchEvent(tooltipEvent)
  },
  hideTooltip(/* event */) {
    if (!this.shouldShowTooltip()) { return }

    const domNode = findDOMNode(this)

    const tooltipEvent = new CustomEvent('the-graph-tooltip-hide', {
      bubbles: true
    })

    if (this.isMounted()) {
      domNode.dispatchEvent(tooltipEvent)
    }
  },
  componentDidMount() {
    if (navigator && navigator.userAgent.indexOf('Firefox') !== -1) {
      // HACK Ff does native tooltips on svg elements
      return
    }

    const showTooltip = this.showTooltip.bind(this)
    const hideTooltip = this.hideTooltip.bind(this)

    const { addEventListener } = this.getTooltipTrigger()

    addEventListener('tap', showTooltip)
    addEventListener('mouseenter', showTooltip)
    addEventListener('mouseleave', hideTooltip)
  }
}

export default Tooltip
