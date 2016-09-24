export default function triggerRender(time) {
  console.log('TRIGGER', this)
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
