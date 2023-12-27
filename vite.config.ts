import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.join(__dirname, "/src"),
            "@resources": path.join(__dirname, "/public/resources"),
        },
    },
    build: {
        target: "es2022",
    },
    define: {
        "import.meta.vitest": undefined,
    },
});
