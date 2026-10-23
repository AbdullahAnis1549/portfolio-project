/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Obsidian Black shades
                obsidian: {
                    DEFAULT: "#07080a",
                    base: "#07080a",
                    surface: "#0c0e14",
                    elevated: "#12151f",
                    card: "rgba(12, 14, 20, 0.75)",
                    border: "rgba(255, 255, 255, 0.08)",
                },
                // Backward-compatible dark tokens mapped to Obsidian Black
                dark: "#07080a",
                darker: "#040406",
                // Electric Blue shades
                electric: {
                    DEFAULT: "#0066ff",
                    blue: "#0066ff",
                    cyan: "#00d2ff",
                    sky: "#38bdf8",
                    deep: "#0052cc",
                    glow: "rgba(0, 102, 255, 0.35)",
                },
                // Primary mapped to Electric Blue
                primary: "#0066ff",
                accent: "#00d2ff",
                // Soft White & Slate
                softWhite: "#f8fafc",
                softSilver: "#e2e8f0",
                softSlate: "#94a3b8",
                textLight: "#f8fafc",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                'electric': '0 0 25px rgba(0, 102, 255, 0.4)',
                'electric-cyan': '0 0 25px rgba(0, 210, 255, 0.35)',
                'obsidian': '0 10px 40px -10px rgba(0, 0, 0, 0.8)',
            },
            animation: {
                'gradient': 'gradient 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                }
            }
        },
    },
    plugins: [],
}
