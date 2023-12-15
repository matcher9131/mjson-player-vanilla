import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        alias: {
            "@": path.join(__dirname, "/src"),
        },
        environment: "jsdom",
        includeSource: ["src/**/*.ts"],
    },
});
