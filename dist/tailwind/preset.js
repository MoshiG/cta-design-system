// GENERATED FILE — do not edit. Source: tokens/*.json, generator: build/build.ts.
//
// Tailwind preset for the Calvary Temple web IMS:
//   // tailwind.config.js
//   presets: [require('@cta/design-system/tailwind-preset')]
//
// CAUTION — this preset sits in theme.extend, so it OVERRIDES Tailwind's built-in
// scales step by step rather than replacing them. Only these steps are ours:
//   neutral: 50, 100, 200, 300, 500, 600, 700, 800, 900
//   gold-400, gold-500, gold-600, gold-700
// Any other step (neutral-400, neutral-950, ...) silently falls through to
// Tailwind's own palette, which is a different hue from this design system.
// If a design needs one of those steps, add it to tokens/color.json first —
// do not reach for the Tailwind default.

module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "gold": {
          "400": "#FACC15",
          "500": "#F59E0B",
          "600": "#D97706",
          "700": "#B45309"
        },
        "neutral": {
          "50": "#F9FAFB",
          "100": "#F3F4F6",
          "200": "#E5E7EB",
          "300": "#D1D5DB",
          "500": "#6B7280",
          "600": "#4B5563",
          "700": "#374151",
          "800": "#1F2937",
          "900": "#111827"
        },
        "success": "#16A34A",
        "warning": "#F59E0B",
        "danger": "#DC2626",
        "info": "#0284C7",
        "onGold": "#451A03",
        "espresso": "#292018",
        "chip": {
          "info": {
            "bg": "#F3F4F6",
            "fg": "#374151"
          },
          "success": {
            "bg": "#DCFCE7",
            "fg": "#166534"
          },
          "warning": {
            "bg": "#FEF3C7",
            "fg": "#92400E"
          },
          "danger": {
            "bg": "#FEE2E2",
            "fg": "#991B1B"
          }
        }
      },
      "spacing": {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px"
      },
      "borderRadius": {
        "sm": "6px",
        "md": "10px",
        "lg": "14px",
        "xl": "20px",
        "pill": "999px"
      },
      "boxShadow": {
        "raised": "0px 2px 6px rgba(17, 24, 39, 0.06)",
        "modal": "0px 12px 32px rgba(17, 24, 39, 0.12)"
      },
      "fontFamily": {
        "display": [
          "Fredoka",
          "sans-serif"
        ],
        "body": [
          "Mona Sans",
          "sans-serif"
        ]
      },
      "backgroundImage": {
        "gold": "linear-gradient(135deg, #FACC15 0%, #D97706 100%)"
      }
    }
  }
};
