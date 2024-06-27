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
      keyframes: {
        fadeIn: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},

        },
        slideTtB: { 
          '0%, 100%': {transform: 'translateY(-50%)'},
          '50%': {transform: 'translateY(0%)'},
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideTtB: 'slideTtB 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config

