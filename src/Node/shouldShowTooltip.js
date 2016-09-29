import Config from '../Config'

export default function shouldShowTooltip() {
  return (this.props.app.state.scale < Config.base.zbpNormal)
}

