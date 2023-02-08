import Link from 'next/link'
import { CSSProperties, ReactNode } from 'react'

export function MyLink({
  href,
  children,
  className,
  style,
  targetBlank,
  textColorClassOverride,
  underline = true,
}: {
  href: string
  children: ReactNode
  className?: string
  targetBlank?: boolean
  style?: CSSProperties
  textColorClassOverride?: string
  underline?: boolean
}) {
  const targetAttributes = targetBlank
    ? {
        target: '_blank',
        rel: 'noreferrer noopener',
      }
    : null
  return (
    <Link
      {...{ href }}
      className={`${
        textColorClassOverride ?? 'text-black'
      } underline-offset-4 ${underline ? 'underline' : ''} ${className ?? ''}`}
      {...{ style, ...targetAttributes }}
    >
      {children}
    </Link>
  )
}
