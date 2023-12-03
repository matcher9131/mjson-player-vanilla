import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.join(__dirname, "/src"),
        },
    },
    build: {
        target: "es2022",
    },
});
