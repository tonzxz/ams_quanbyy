/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@spartan-ng/brain/hlm-tailwind-preset'),
  ],
  important: true,

  content: [
    './src/**/*.{html,ts,scss}', 
    './src/app/components/**/*.{html,ts,scss}', 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
