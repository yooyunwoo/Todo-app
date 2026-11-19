import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // DB 접속(토큰 사용)은 lib/db.ts 한 곳에서만 한다.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    ignores: ["lib/db.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@libsql/client",
              message: "DB 접속은 lib/db.ts의 getDb()를 통해서만 하세요.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
