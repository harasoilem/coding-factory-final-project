/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'decorative': '#CBB07A',
        'nurse-app-pink-dark': '#794242',
        'nurse-app-pink-light': '#B78A8A',
        'nurse-app-pink': '#956161',
        'nurse-app-gray': '#E7ECF2',
        'nurse-app-gray-2': '#F8F8F8',
        'nurse-app-toggle-unselected': '#AA9090',
        'nurse-app-black': '#000000',
        'nurse-app-header-color': '#013B51',
        'nurse-app-button-color': '#20293A',
        'nurse-app-menu-color': '#364153',
        'nurse-app': {
          '50': '#F8FAFC',
          '100': '#F1F5F9',
          '200': '#E2E8F0',
          '300': '#CBD5E1',
          '400': '#94A3B8',
          '500': '#64748B',
          '600': '#475569',
          '700': '#334155',
          '800': '#1E293B',
          '900': '#0F172A',
        }
      },
    },
  },
  plugins: [],
}
