/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,njk,md,js}",
    "./src/_includes/**/*.{html,njk}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16A34A",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#0A2F1F",
        },
        forest: {
          DEFAULT: "#0A2F1F",
          50: "#E8F5EE",
          100: "#C5E8D5",
          200: "#8FD1AB",
          300: "#5ABB82",
          400: "#2A9A5B",
          500: "#1A6B40",
          600: "#145533",
          700: "#0F4028",
          800: "#0A2F1F",
          900: "#051A11",
        },
        sage: "#F0FDF4",
        accent: "#86EFAC",
      },
      fontFamily: {
        heading: [
          "Fraunces",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        body: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        brand: ["Playfair Display", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-delay": "fadeIn 0.6s ease-out 0.2s forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-up-delay": "slideUp 0.6s ease-out 0.3s forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, rgba(10,47,31,0.9) 0%, rgba(22,163,74,0.5) 50%, rgba(10,47,31,0.3) 100%)",
        "hero-gradient-bottom":
          "linear-gradient(to top, rgba(10,47,31,0.95) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(to top, rgba(10,47,31,0.8) 0%, transparent 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(22, 163, 74, 0.15)",
        "glow-lg": "0 0 60px rgba(22, 163, 74, 0.25)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
