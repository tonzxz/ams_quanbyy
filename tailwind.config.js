/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@spartan-ng/brain/hlm-tailwind-preset'), // Ensure this package is installed
  ],
  content: [
    './src/**/*.{html,ts,scss}', // Include SCSS files for Tailwind processing
    './src/app/components/**/*.{html,ts,scss}', // Ensure your Spartan components are scanned
  ],
  theme: {
    extend: {}, // Add custom theme extensions here if needed
  },
  plugins: [], // Add any required plugins here (e.g., forms, typography)
};
