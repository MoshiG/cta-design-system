// GENERATED FILE — do not edit. Source: tokens/*.json, generator: build/build.ts.

export const tokens = {
  "color": {
    "gold400": "#FACC15",
    "gold500": "#F59E0B",
    "gold600": "#D97706",
    "gold700": "#B45309",
    "neutral50": "#F9FAFB",
    "neutral100": "#F3F4F6",
    "neutral200": "#E5E7EB",
    "neutral300": "#D1D5DB",
    "neutral500": "#6B7280",
    "neutral600": "#4B5563",
    "neutral700": "#374151",
    "neutral800": "#1F2937",
    "neutral900": "#111827",
    "success": "#16A34A",
    "warning": "#F59E0B",
    "danger": "#DC2626",
    "info": "#0284C7",
    "onGold": "#451A03",
    "espresso": "#292018",
    "chipInfoBg": "#F3F4F6",
    "chipInfoFg": "#374151",
    "chipSuccessBg": "#DCFCE7",
    "chipSuccessFg": "#166534",
    "chipWarningBg": "#FEF3C7",
    "chipWarningFg": "#92400E",
    "chipDangerBg": "#FEE2E2",
    "chipDangerFg": "#991B1B"
  },
  "spacing": {
    "s1": 4,
    "s2": 8,
    "s3": 12,
    "s4": 16,
    "s5": 20,
    "s6": 24,
    "s8": 32,
    "s10": 40,
    "s12": 48,
    "s16": 64,
    "s20": 80,
    "s24": 96
  },
  "frame": {
    "screenInset": 16,
    "bottomNavHeight": 64
  },
  "radii": {
    "sm": 6,
    "md": 10,
    "lg": 14,
    "xl": 20,
    "pill": 999
  },
  "typography": {
    "family": {
      "display": {
        "name": "Fredoka",
        "delivery": {
          "flutter": "google_fonts",
          "web": "google-fonts"
        },
        "fallback": [
          "sans-serif"
        ]
      },
      "body": {
        "name": "Mona Sans",
        "delivery": {
          "flutter": "google_fonts",
          "web": "self-hosted"
        },
        "fallback": [
          "sans-serif"
        ],
        "$divergence": "Mona Sans is not available through the google_fonts package, so the Flutter app renders Montserrat — the closest geometric-humanist substitute — while the web can self-host real Mona Sans. Recorded rather than hidden: the two clients are not pixel-identical in body text until Mona Sans is self-hosted on mobile too.",
        "flutterSubstitute": "Montserrat"
      }
    },
    "scale": {
      "mobile": {
        "displayLg": {
          "family": "display",
          "size": 32,
          "weight": 700,
          "lineHeight": 1.15
        },
        "displayMd": {
          "family": "display",
          "size": 26,
          "weight": 700,
          "lineHeight": 1.2
        },
        "displaySm": {
          "family": "display",
          "size": 22,
          "weight": 600,
          "lineHeight": 1.25
        },
        "titleLg": {
          "family": "body",
          "size": 20,
          "weight": 600,
          "lineHeight": 1.3
        },
        "titleMd": {
          "family": "body",
          "size": 18,
          "weight": 600,
          "lineHeight": 1.35
        },
        "titleSm": {
          "family": "body",
          "size": 16,
          "weight": 600,
          "lineHeight": 1.4
        },
        "bodyLg": {
          "family": "body",
          "size": 16,
          "weight": 400,
          "lineHeight": 1.5
        },
        "bodyMd": {
          "family": "body",
          "size": 14,
          "weight": 400,
          "lineHeight": 1.5
        },
        "bodySm": {
          "family": "body",
          "size": 13,
          "weight": 400,
          "lineHeight": 1.45
        },
        "labelLg": {
          "family": "body",
          "size": 14,
          "weight": 600,
          "lineHeight": 1.3
        },
        "labelMd": {
          "family": "body",
          "size": 12,
          "weight": 600,
          "lineHeight": 1.3
        },
        "caption": {
          "family": "body",
          "size": 11,
          "weight": 500,
          "lineHeight": 1.3
        }
      }
    }
  },
  "elevation": {
    "none": {
      "kind": "none"
    },
    "card": {
      "kind": "border",
      "width": 1,
      "color": "{neutral.200}"
    },
    "raised": {
      "kind": "shadow",
      "x": 0,
      "y": 2,
      "blur": 6,
      "spread": 0,
      "color": "#111827",
      "opacity": 0.06
    },
    "modal": {
      "kind": "shadow",
      "x": 0,
      "y": 12,
      "blur": 32,
      "spread": 0,
      "color": "#111827",
      "opacity": 0.12
    }
  },
  "container": {
    "reading": 44,
    "content": 72,
    "wide": 80
  },
  "motion": {
    "duration": {
      "fast": 150,
      "base": 250,
      "slow": 500
    },
    "easing": {
      "standard": [
        0.4,
        0,
        0.2,
        1
      ],
      "spring": [
        0.34,
        1.56,
        0.64,
        1
      ]
    }
  }
} as const;

export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radii;
export type TextToken = keyof typeof tokens.typography.scale.mobile;

export default tokens;
