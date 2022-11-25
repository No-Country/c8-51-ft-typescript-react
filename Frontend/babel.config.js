module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['transform-inline-environment-variables', 'module:react-native-dotenv'],
    env: {
      production: {
        plugins: ["react-native-paper/babel", "transform-inline-environment-variables"],

      },
    },
  };
};
