export default function updateIcon(nodeId: string, icon: string) {
  this.updatedIcons[nodeId] = icon
  this.markDirty()
}
