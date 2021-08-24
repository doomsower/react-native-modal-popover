/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');

const libRoot = path.resolve(__dirname, '..');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [libRoot],
  resolver: {
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      react: path.resolve(__dirname, 'node_modules/react'),
    },
    blacklistRE: blacklist([
      new RegExp(`${libRoot}/node_modules/react-native/.*`),
      new RegExp(`${libRoot}/node_modules/react/.*`),
    ]),
  },
};
