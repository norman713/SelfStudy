const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.server = {
  ...config.server,
  port: 5173,
};

module.exports = withNativeWind(config, { input: "./global.css" });
