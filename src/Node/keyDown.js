export default function keyDown(event) {
  const { metaKey, ctrlKey } = event

  if (metaKey || ctrlKey) {
    this.metaKeyPressed = true;
  }
}
