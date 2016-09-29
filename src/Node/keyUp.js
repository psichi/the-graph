export default function keyUp(event) {
  const { metaKey, ctrlKey } = event

  if (metaKey || ctrlKey) {
    this.metaKeyPressed = false;
  }
}
