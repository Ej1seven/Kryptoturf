// __craco.config.js__
// touch craco.config.js

// add the following content in the craco.config.js
module.exports = {
  style: {
    postcssOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
