import { PiX } from 'react-icons/pi';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main_color: '#FFFFFF',
        secundary_color: '#ED0C0C',
        bg_color: '#0B0B0B'
      },
      spacing: {
        'header': '10dvh',
        'body': '90dvh',
        '680': '680px'

      }
    },
    borderWidth: {
      '1': '1px',
    }
  },
  plugins: [],
}

