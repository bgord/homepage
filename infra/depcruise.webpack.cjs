/* depcruise.webpack.cjs */
const path = require("node:path");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "+app": path.resolve(__dirname, "app"),
      "+infra": path.resolve(__dirname, "infra"),
      "+languages": path.resolve(__dirname, "modules/supported-languages.ts"),
    },
  },
};
