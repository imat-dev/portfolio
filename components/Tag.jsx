import React from 'react'
import classNames from 'clsx'

const Tag = (props) => {
  const { children, className, slug, ...rest } = props

  // Tags are intentionally not links (href was removed in fcbf1c9); Next 16 <Link>
  // throws without an href, so render a plain element in both cases.
  const isLinked = Array.isArray(slug)
  const Component = 'span'

  return (
    <Component
      className={classNames(
        'inline-block select-none px-3 py-1 uppercase no-underline',
        'bg-beta/10 text-beta',
        isLinked && 'hover:bg-beta/20',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Tag
