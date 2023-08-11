module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-env',
  '@babel/preset-react', ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true
    }],
    [
      "@babel/plugin-transform-private-property-in-object", { "loose": true }
  ],
  [
      "@babel/plugin-transform-private-methods", { "loose": true }
  ],
  ["@babel/plugin-transform-class-properties", { "loose": true }],
  
    '@babel/plugin-transform-export-namespace-from', // This line
    'react-native-reanimated/plugin', // And this line
  ],
};
