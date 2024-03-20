import type {Config} from "tailwindcss";
import colors from "tailwindcss/colors";

const {nextui} = require("@nextui-org/react");

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        transparent: 'transparent',
        current: 'currentColor',
        extend: {
            borderRadius: {
                'tremor-small': '0.375rem',
                'tremor-default': '0.5rem',
                'tremor-full': '9999px',
            },
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            colors: {
                tremor: {
                    brand: {
                        faint: colors.blue[50],
                        muted: colors.blue[200],
                        subtle: colors.blue[400],
                        DEFAULT: colors.blue[500],
                        emphasis: colors.blue[700],
                        inverted: colors.white,
                    },
                    background: {
                        muted: colors.slate[50],
                        subtle: colors.slate[100],
                        DEFAULT: colors.white,
                        emphasis: colors.slate[600],
                    },
                    border: {
                        DEFAULT: colors.slate[200],
                    },
                    ring: {
                        DEFAULT: colors.slate[200],
                    },
                    content: {
                        subtle: colors.slate[400],
                        DEFAULT: colors.slate[500],
                        emphasis: colors.slate[700],
                        strong: colors.slate[900],
                        inverted: colors.white,
                    },
                },
                // dark mode
                'dark-tremor': {
                    brand: {
                        faint: '#0B1229',
                        muted: colors.blue[950],
                        subtle: colors.blue[800],
                        DEFAULT: colors.blue[500],
                        emphasis: colors.blue[400],
                        inverted: colors.blue[950],
                    },
                    background: {
                        muted: '#131A2B',
                        subtle: colors.slate[800],
                        DEFAULT: colors.slate[900],
                        emphasis: colors.slate[600],
                    },
                    border: {
                        DEFAULT: colors.slate[800],
                    },
                    ring: {
                        DEFAULT: colors.slate[800],
                    },
                    content: {
                        subtle: colors.slate[600],
                        DEFAULT: colors.slate[500],
                        emphasis: colors.slate[200],
                        strong: colors.slate[50],
                        inverted: colors.slate[950],
                    },
                },
            },
            boxShadow: {
                // light
                'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'tremor-card':
                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'tremor-dropdown':
                    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                // dark
                'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'dark-tremor-card':
                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'dark-tremor-dropdown':
                    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            fontSize: {
                'tremor-label': ['0.75rem', {lineHeight: '1rem'}],
                'tremor-default': ['0.875rem', {lineHeight: '1.25rem'}],
                'tremor-title': ['1.125rem', {lineHeight: '1.75rem'}],
                'tremor-metric': ['1.875rem', {lineHeight: '2.25rem'}],
            },
        },
    },
    darkMode: "class",
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
    ],
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
    }),
        require('tailwindcss-animated'), require('@headlessui/tailwindcss')],
};

export default config;
