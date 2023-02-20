import { ReactNode } from 'react'

export function NiceItalic({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif text-[1.1em] italic leading-none">
      {children}
    </span>
  )
}
