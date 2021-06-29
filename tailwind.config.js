module.exports = {
  // Uncomment the line below to enable the experimental Just-in-Time ("JIT") mode.
  // https://tailwindcss.com/docs/just-in-time-mode
  // mode: "jit",
  theme: {
    extend: {},
    fontFamily: {
      'oswald': ['Oswald', 'ui-sans-serif', 'sans-serif'],
      'montserrat': ['Montserrat', 'ui-sans-serif', 'sans-serif'],
      'roboto': ['Roboto', 'ui-sans-serif', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      width: ['hover', 'group-hover'],
      textAlign: ['group-hover'],
      alignSelf: ['group-hover']
    }
  },
  plugins: [],
  purge: {
    // Filenames to scan for classes
    content: [
      "./src/**/*.html",
      "./src/**/*.js",
      "./src/**/*.jsx",
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "./public/index.html",
    ],
    // Options passed to PurgeCSS
    options: {
      // Whitelist specific selectors by name
      // safelist: [],
    },
  },
};
