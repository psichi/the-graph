import { action } from '@kadira/storybook'

const edgeActions = {
  delete: action('Delete Edge')
}

const nodeActions = {
  delete: action('Delete Node'),
  copy: action('Copy Node')
}

const pasteMenu = {
  icon: 'paste',
  iconLabel: 'paste',
  action: action('Paste')
}

export default {
  main: {
    icon: 'sitemap',
    e4: pasteMenu
  },
  edge: {
    // this is not used I assume?
    actions: edgeActions,
    icon: 'long-arrow-right',
    s4: {
      icon: 'trash-o',
      iconLabel: 'delete',
      action: edgeActions.delete
    }
  },
  node: {
    actions: nodeActions,
    s4: {
      icon: 'trash-o',
      iconLabel: 'delete',
      action: nodeActions.delete
    },
    w4: {
      icon: 'copy',
      iconLabel: 'copy',
      action: nodeActions.copy
    }
  },
  nodeInport: {
    w4: {
      icon: 'sign-in',
      iconLabel: 'export',
      action: action('Export Inport')
    }
  },
  nodeOutport: {
    e4: {
      icon: 'sign-out',
      iconLabel: 'export',
      action: action('Export Outport')
    }
  },
  graphInport: {
    icon: 'sign-in',
    iconColor: 2,
    n4: {
      label: 'inport'
    },
    s4: {
      icon: 'trash-o',
      iconLabel: 'delete',
      action: action('Delete Inport')
    }
  },
  graphOutport: {
    icon: 'sign-out',
    iconColor: 5,
    n4: {
      label: 'outport'
    },
    s4: {
      icon: 'trash-o',
      iconLabel: 'delete',
      action: action('Delete Outport')
    }
  },
  group: {
    icon: 'th',
    s4: {
      icon: 'trash-o',
      iconLabel: 'ungroup',
      action: action('Ungroup')
    },
    // TODO copy group?
    e4: pasteMenu
  },
  selection: {
    icon: 'th',
    w4: {
      icon: 'copy',
      iconLabel: 'copy',
      action: action('Copy')
    },
    e4: pasteMenu
  }
}
