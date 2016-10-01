export default function debounceLibraryRefesh() {
  // Breaking the "no debounce" rule, this fixes #76 for subgraphs
  if (this.debounceLibraryRefeshTimer) {
    clearTimeout(this.debounceLibraryRefeshTimer)
  }
  this.debounceLibraryRefeshTimer = setTimeout(() => {
    this.rerender({ libraryDirty: true })
  }, 200)
}
