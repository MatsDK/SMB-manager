/** @type {import('tailwindcss').Config} */

function withOpacity(cssVariable) {
  return ({ opacityValue }) => {
    return opacityValue ? `rgba(var(${cssVariable}), ${opacityValue})` : `rgb(var(${cssVariable}))`
  }
}

module.exports = {
  content: ["src/**/*.tsx"],
  theme: {
    colors: {
      'primary-bg': withOpacity('--color-primary-bg'),
      'secondary-bg': withOpacity('--color-secondary-bg'),
      'primary-text': withOpacity('--color-primary-text'),
      'secondary-text': withOpacity('--color-secondary-text'),
    },
  },
  plugins: []
}
