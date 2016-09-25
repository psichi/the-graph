export default function updateIcon(nodeId, icon) {
  this.updatedIcons[nodeId] = icon
  this.markDirty()
}
