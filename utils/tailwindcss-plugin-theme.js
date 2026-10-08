const plugin = require('tailwindcss/plugin')

const flattenColorPalette = (colors) =>
  Object.assign(
    colors[500] ? { DEFAULT: colors[500] } : {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  )

// Each theme writes its palette to CSS variables (`--theme-alpha-500`, ...) on
// `html` (default theme) or on a `.<themeName>` class. Utilities read the
// variable, and Tailwind 4 applies opacity modifiers (`bg-omega-800/90`) to it
// with color-mix(), so any CSS color format (hex, oklch) works.
// The `--theme-` prefix keeps these clear of Tailwind 4's own `--color-*` theme
// variables.
module.exports = plugin.withOptions(
  (options = {}) => {
    return ({ addBase }) => {
      const { themes } = options

      const stylesToAdd = Object.entries(themes).reduce((cssClasses, [themeName, theme]) => {
        const styles = {}

        Object.entries(flattenColorPalette(theme)).forEach(
          ([color, value]) => value && (styles['--theme-' + color] = value)
        )

        const cssSelector = themeName === 'default' ? 'html' : `.${themeName}`
        cssClasses[cssSelector] = styles

        return cssClasses
      }, {})

      addBase(stylesToAdd)
    }
  },

  function (options = {}) {
    const { themes } = options

    const colors = Object.values(themes).reduce((variables, theme) => {
      Object.keys(flattenColorPalette(theme)).forEach(
        (rule) => (variables[rule] = `var(--theme-${rule})`)
      )
      return variables
    }, {})

    return {
      theme: {
        extend: {
          colors: {
            ...colors,
          },
        },
      },
    }
  }
)
