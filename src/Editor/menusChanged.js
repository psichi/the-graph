export default function menusChanged() {
  // Only if the object itself changes,
  // otherwise builds menu from reference every time menu shown
  if (!this.refs.appView) { return }
  this.refs.appView.setProps({ menus: this.menus })
}
