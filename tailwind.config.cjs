/** @type {import('tailwindcss').Config} */
export default {
    content: ["index.html", "./src/**/*.{html,ts}"],
    theme: {
        extend: {
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
