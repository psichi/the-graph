import { action } from '@kadira/storybook'

export default {
  n4: {
    label: 'outport'
  },
  s4: {
    icon: 'trash-o',
    iconLabel: 'delete',
    action: action('delete')
  }
}
