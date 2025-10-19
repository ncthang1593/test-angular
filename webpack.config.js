// webpack.config.js
console.log('✅ Webpack custom config is loaded!');

const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/app/shared')
    },
    fallback: {
      fs: false,
      path: require.resolve('path-browserify')
    }
  }
};
