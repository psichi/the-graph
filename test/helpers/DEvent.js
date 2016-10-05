export default function DEvent (type, options = {}) {
  const event = new window.Event(type, {
    bubbles: true
  })

  Object.keys(options).forEach((option) => {
    event[option] = options[option]
  })

  document.documentElement.dispatchEvent(event)
}
