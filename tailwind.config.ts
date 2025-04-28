import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}", // Bao gồm thư mục components
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // Nếu có
    ],
    theme: {
        extend: {
            colors: {
                "primary-light": "#f5f5f5",
                "second-light": "#a8a8a8",
            },
        },
    },
    plugins: [],
};

export default config;
