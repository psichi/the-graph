import Config from '../Config'

export default function shouldShowTooltip() {
  const { label, scale } = this.props

  return (
    scale < Config.base.zbpBig || label.length > 8
  )
}
