import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {merge} from './utils'
import {
  createMenuSlice,
  createMenuCircleXPath,
  createMenuOutlineCircle,
  createMenuLabelText,
  createMenuMiddleIconRect,
  createMenuMiddleIconText,
  createMenuGroup
} from './factories/menu'

export default class TheGraphMenu extends Component {
  radius = Config.menu.radius

  static propTypes = {
    menu: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.string,
    iconColor: PropTypes.string
  }

  constructor (props, context) {
    super(props, context)

    // Use these in CSS for cursor and hover, and to attach listeners
    this.state = {
      n4tappable: (this.props.menu.n4 && this.props.menu.n4.action),
      s4tappable: (this.props.menu.s4 && this.props.menu.s4.action),
      e4tappable: (this.props.menu.e4 && this.props.menu.e4.action),
      w4tappable: (this.props.menu.w4 && this.props.menu.w4.action)
    }

    this.onTapN4 = this.onTapN4.bind(this)
    this.onTapS4 = this.onTapS4.bind(this)
    this.onTapE4 = this.onTapE4.bind(this)
    this.onTapW4 = this.onTapW4.bind(this)
  }

  onTapN4 () {
    var options = this.props.options
    this.props.menu.n4.action(options.graph, options.itemKey, options.item)
    this.props.triggerHideContext()
  }

  onTapS4 () {
    var options = this.props.options
    this.props.menu.s4.action(options.graph, options.itemKey, options.item)
    this.props.triggerHideContext()
  }

  onTapE4 () {
    var options = this.props.options
    this.props.menu.e4.action(options.graph, options.itemKey, options.item)
    this.props.triggerHideContext()
  }

  onTapW4 () {
    var options = this.props.options
    this.props.menu.w4.action(options.graph, options.itemKey, options.item)
    this.props.triggerHideContext()
  }

  componentDidMount () {
    if (this.state.n4tappable) {
      this.refs.n4.addEventListener('up', this.onTapN4)
    }
    alert('did mount')
    console.log('REFS', this.refs)

    /*
    // refs are not available yet.
    if (this.state.s4tappable) {
      alert('2')
      // refs are empty
      console.log('refs', this.refs)
      // hm ok this ref depends on what config?
      this.refs.s4.addEventListener('up', this.onTapS4);
    }
    if (this.state.e4tappable) {
      this.refs.e4.addEventListener('up', this.onTapE4);
    }
    if (this.state.w4tappable) {
      this.refs.w4.addEventListener('up', this.onTapW4);
    }
    */

    // Prevent context menu
    const domNode = findDOMNode(this)
    alert(domNode)
    domNode.addEventListener('contextmenu', function (event) {
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }
    }, false)
  }

  getPosition () {
    return {
      x: this.props.x !== undefined ? this.props.x : this.props.options.x || 0,
      y: this.props.y !== undefined ? this.props.y : this.props.options.y || 0
    }
  }

  render () {
    alert('render', this.refs)
    var menu = this.props.menu
    var options = this.props.options
    var position = this.getPosition()

    var circleXOptions = merge(Config.menu.circleXPath, {})
    var outlineCircleOptions = merge(Config.menu.outlineCircle, {r: this.radius })

    var children = [
      // Directional slices
      createMenuSlice(this, { direction: 'n4' }),
      createMenuSlice(this, { direction: 's4' }),
      createMenuSlice(this, { direction: 'e4' }),
      createMenuSlice(this, { direction: 'w4' }),
      // Outline and X
      createMenuCircleXPath(circleXOptions),
      createMenuOutlineCircle(outlineCircleOptions)
    ]
    // Menu label
    if (this.props.label || menu.icon) {
      var labelTextOptions = {
        x: 0,
        y: 0 - this.radius - 15,
        children: (this.props.label ? this.props.label : menu.label)
      }

      labelTextOptions = merge(Config.menu.labelText, labelTextOptions)
      children.push(createMenuLabelText(labelTextOptions))
    }
    // Middle icon
    if (this.props.icon || menu.icon) {
      var iconColor = (this.props.iconColor !== undefined ? this.props.iconColor : menu.iconColor)
      var iconStyle = ''
      if (iconColor) {
        iconStyle = ' fill route' + iconColor
      }

      var middleIconRectOptions = merge(Config.menu.iconRect, {})
      var middleIcon = createMenuMiddleIconRect(middleIconRectOptions)

      var middleIconTextOptions = {
        className: 'icon context-node-icon' + iconStyle,
        children: Config.FONT_AWESOME[ (this.props.icon ? this.props.icon : menu.icon) ]
      }
      middleIconTextOptions = merge(Config.menu.iconText, middleIconTextOptions)
      var iconText = createMenuMiddleIconText(middleIconTextOptions)

      children.push(middleIcon, iconText)
    }

    var containerOptions = {
      transform: 'translate(' + position.x + ',' + position.y + ')',
      children: children
    }

    containerOptions = merge(Config.menu.container, containerOptions)

    return createMenuGroup(containerOptions)
  }
}
