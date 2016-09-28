// trigger should not be necessary.
export default function triggerRender(time) {
  /*
   if (!this.isMounted()) {
   return;
   }
   */
  if (this.dirty) {
    return
  }
  this.dirty = true
  this.forceUpdate()
}
