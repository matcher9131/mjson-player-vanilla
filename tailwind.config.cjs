/** @type {import('tailwindcss').Config} */
export default {
    content: ["index.html", "./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                floralwhite: "#fffaf0",
            },
            keyframes: {
                fadeOut: {
                    "0%, 50%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
            },
        },
    },
    plugins: [],
};
