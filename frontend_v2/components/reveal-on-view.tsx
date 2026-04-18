"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { inView } from "motion"

type RevealOnViewProps = {
  as?: string
  className?: string
  children: ReactNode
  delay?: number
  style?: CSSProperties
  intensity?: "soft" | "hero"
  staggerChildren?: boolean
}

export default function RevealOnView({ as, className, children, delay = 0, style, intensity = "soft", staggerChildren = false }: RevealOnViewProps) {
  void as
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const startTranslate = intensity === "hero" ? 20 : 12
    const startBlur = intensity === "hero" ? 12 : 8
    const startScale = intensity === "hero" ? 0.97 : 0.985

    if (staggerChildren) {
      element.style.opacity = "1"
      element.style.transform = "none"
      element.style.filter = "none"
    } else {
      element.style.opacity = "0"
      element.style.transform = `translateY(${startTranslate}px) scale(${startScale})`
      element.style.filter = `blur(${startBlur}px)`
    }

    const cleanup = inView(element, () => {
      const targets = staggerChildren ? (Array.from(element.children) as HTMLElement[]) : [element]

      targets.forEach((target, index) => {
        target.style.opacity = "0"
        target.style.transform = `translateY(${startTranslate}px) scale(${startScale})`
        target.style.filter = `blur(${startBlur}px)`

        target.animate(
          [
            { opacity: 0, transform: `translateY(${startTranslate}px) scale(${startScale})`, filter: `blur(${startBlur}px)` },
            { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
          ],
          {
            duration: 600,
            delay: (delay + (targets.length > 1 ? index * 0.08 : 0)) * 1000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        )
      })
    })

    return () => cleanup()
  }, [delay, intensity, staggerChildren])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
