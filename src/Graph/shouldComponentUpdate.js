export default function shouldComponentUpdate() {
  // If ports change or nodes move, then edges need to rerender, so we do the whole graph
  return this.dirty
}
