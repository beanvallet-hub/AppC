module.exports = function (api) {
  api.cache.using(() => process.env.APP_ENV);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: false,
        },
        
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
          },
        },
      ],
      [
        'react-native-worklets/plugin',
      ]
    ],
  };
};
