module.exports = {
    plugins: ["@typescript-eslint", "prettier"],
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        extends: ["@guardian/eslint-config-typescript"],
        rules: {
            "@typescript-eslint/strict-boolean-expressions": [
                "error",
                {
                    allowString: false,
                    allowNumber: false,
                    allowNullableObject: false,
                    allowNullableBoolean: false,
                    allowNullableString: false,
                    allowNullableNumber: false,
                    allowAny: false,
                }
            ],
        },
      },
      {
        "files": ["demo.config.js"],
        "env": {
          "es6": true
        }
      }
    ],
  };
