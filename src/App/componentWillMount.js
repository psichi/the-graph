import { klayNoflo } from '../utils'

export default function componentWillMount() {
  const { klayjs } = this.props

  // Initializes the autolayouter
  this.autolayouter = klayNoflo.create({
    onSuccess: this.applyAutolayout.bind(this),
    workerScript: klayjs
  })
}
