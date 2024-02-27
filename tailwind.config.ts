import type {Config} from "tailwindcss";

const {nextui} = require("@nextui-org/react");

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [nextui({
        themes: {
            "tech-dark": {
                extend: "dark",
                colors: {
                    background: "#0D001A",
                    foreground: "#ffffff",
                    primary: {
                        50: "#f8fafc",
                        100: "#f1f5f9",
                        200: "#e2e8f0",
                        300: "#cbd5e1",
                        400: "#94a3b8",
                        500: "#64748b",
                        600: "#475569",
                        700: "#334155",
                        800: "#1e293b",
                        900: "#0f172a",
                        950: "#020617",
                        DEFAULT: "#64748b",
                        foreground: "#ffffff",
                    },
                    focus: "#F182F6",
                }
            },
            "tech-light": {
                extend: "light",
                colors: {
                    background: "#ffffff",
                    foreground: "#000000",
                    primary: {
                        50: "#f8fafc",
                        100: "#f1f5f9",
                        200: "#e2e8f0",
                        300: "#cbd5e1",
                        400: "#94a3b8",
                        500: "#64748b",
                        600: "#475569",
                        700: "#334155",
                        800: "#1e293b",
                        900: "#0f172a",
                        950: "#020617",
                        DEFAULT: "#64748b",
                        foreground: "#000000",
                    },
                    focus: "#F182F6",
                }
            }
        }
    }), require('tailwindcss-animated')],
};

export default config;
