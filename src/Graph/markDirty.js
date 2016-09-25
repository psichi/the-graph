export default function markDirty(event) {
  if (event && event.libraryDirty) {
    this.libraryDirty = true
  }
  window.requestAnimationFrame(this.triggerRender)
}
