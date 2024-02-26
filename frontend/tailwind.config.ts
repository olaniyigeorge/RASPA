import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      color: {
        rasppurple: "#FC911F"
      },
    },
  },
  plugins: [],
} satisfies Config

