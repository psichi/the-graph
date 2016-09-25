export default function keyUp(event) {
  // Escape
  if (event.keyCode === 27) {
    if (!this.refs.graph) {
      return
    }
    this.refs.graph.cancelPreviewEdge()
  }

  /*
   // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29
   if (TheGraph.metaKeyPressed) {
   TheGraph.metaKeyPressed = false;
   }
   */
}
