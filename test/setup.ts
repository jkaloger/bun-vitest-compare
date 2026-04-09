import { Window } from "happy-dom"

const window = new Window({ url: "http://localhost" }) as unknown as Window &
  typeof globalThis

for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue
  try {
    Object.defineProperty(globalThis, key, {
      value: (window as any)[key],
      writable: true,
      configurable: true,
    })
  } catch {
    // skip non-configurable properties
  }
}

// Bun 1.0.x fails to resolve Symbol-keyed methods defined later in a class
// body when the constructor runs. Because bindMethods was skipped, we must
// manually bind critical methods from the full prototype chain.
let proto = window
while (proto && proto !== Object.prototype) {
  for (const key of Object.getOwnPropertyNames(proto)) {
    try {
      const desc = Object.getOwnPropertyDescriptor(proto, key)
      if (desc && typeof desc.value === "function" && !(key in (window as any))) {
        ;(window as any)[key] = desc.value.bind(window)
      }
    } catch {}
  }
  for (const sym of Object.getOwnPropertySymbols(proto)) {
    try {
      const desc = Object.getOwnPropertyDescriptor(proto, sym)
      if (desc && typeof desc.value === "function" && !(sym in (window as any))) {
        ;(window as any)[sym] = desc.value.bind(window)
      }
    } catch {}
  }
  proto = Object.getPrototypeOf(proto)
}

// Stub getComputedStyle if not available (needed by RTL role queries)
if (typeof (window as any).getComputedStyle !== "function") {
  ;(window as any).getComputedStyle = () =>
    new Proxy(
      {},
      {
        get: (_t, prop) => (prop === "length" ? 0 : ""),
      },
    )
}

;(globalThis as any).window = window
;(globalThis as any).document = window.document
;(globalThis as any).self = window

if (!(window as any).navigator?.userAgent) {
  Object.defineProperty(window, "navigator", {
    value: { userAgent: "Mozilla/5.0 (happy-dom)" },
    writable: true,
    configurable: true,
  })
}
;(globalThis as any).navigator = (window as any).navigator

export {}
