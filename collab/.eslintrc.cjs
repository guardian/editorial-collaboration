module.exports = {
    plugins: ["@typescript-eslint", "prettier"],
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        extends: ["@guardian/eslint-config-typescript"],
      },
    ],
  };
