module.exports = {
    resolve: {
      fallback: {
        "fs": false,
        tty: require.resolve('tty-browserify'),
        zlib: require.resolve('browserify-zlib'),
      },
    },
  };