import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/sw.js",
  ]),
  {
    rules: {
      // Prevent unused variables (warn instead of error for dev flexibility)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      // Prefer const
      "prefer-const": "warn",
      // No console.log in production (allow warn/error)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Enforce consistent return types
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
        disallowTypeAnnotations: false,
      }],
      // React best practices
      "react/self-closing-comp": "warn",
      "react/jsx-no-target-blank": "error",
      // Next.js specific
      "@next/next/no-img-element": "error",
      // App Router uses layout.tsx, not _document.js
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;
