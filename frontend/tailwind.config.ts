import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      color: {
        rasppurple: "#FC911F"
      },
      screens: {
        // 'xs': '320px',    // Extra small devices (phones)
        'sm': '450px',    // Small devices (phones)
        'md': '600px',    // Medium devices (tablets)
        'lg': '900px',   // Large devices (laptops/desktops)
        'xl': '1024px',   // Extra large devices (large laptops/desktops)
        'xxl': '1204px',  // 2x Extra large devices
      },
    },
  },
  plugins: [],
} satisfies Config

