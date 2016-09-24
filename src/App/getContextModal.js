// can be moved to app modal gropu
export default function getContextModal() {
  const { contextMenu: currentContextMenu } = this.props
  const { width, height } = this.state

  if (currentContextMenu) {
    const { element: { getContext } } = currentContextMenu

    const menu = getMenuDef(currentContextMenu)

    if (menu) {
      contextMenu = getContext(menu, currentContextMenu, this.hideContext)

      const modalBGOptions = {
        width,
        height,
        triggerHideContext: this.hideContext
      }

      this.menuShown = true

      return [
        (
          <AppModalBackground {...modalBGOptions}>
            {contextMenu}
          </AppModalBackground>
        )
      ]
    }
  }

  this.menuShown = false

  return null
}
