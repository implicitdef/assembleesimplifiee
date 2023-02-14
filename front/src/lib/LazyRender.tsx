import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

// (or immediately if it's already visible)
function onApproachingViewport(
  {
    htmlElement,
    // how far from the viewport it needs to be for the callback to trigger
    margin = 1000,
    // if true, the callback will be fired only once
    // and we will stop observing
    once = true,
  }: { htmlElement: HTMLElement; margin?: number; once?: boolean },
  callback: () => void,
) {
  const observer = new IntersectionObserver(
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        callback()
        if (once) {
          observer.unobserve(htmlElement)
        }
      }
    },
    {
      root: null, // the viewport
      rootMargin: `${margin}px`,
      threshold: 0,
    },
  )
  observer.observe(htmlElement)
}

export function LazyRender({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  const [displayed, setDisplayed] = useState(false)

  const onRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      onApproachingViewport(
        {
          htmlElement: node,
          margin: 0,
        },
        () => {
          console.log('@callback triggerred')
          setDisplayed(true)
        },
      )
    }
  }, [])

  return (
    <div ref={onRef} className={className}>
      {displayed ? children : null}
    </div>
  )
}
