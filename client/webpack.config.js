const path = require('path');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/main.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'public'),
    },
    watch: isDev,
  }
};
