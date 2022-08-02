import { resolve } from 'path';

module.exports = {
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
    },
  },
};
