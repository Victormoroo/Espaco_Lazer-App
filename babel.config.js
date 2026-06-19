module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Obrigatório para o react-native-reanimated 4 (worklets). Deve ser o último plugin.
    plugins: ['react-native-worklets/plugin'],
  };
};
