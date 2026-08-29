"""Contrast ratios for the pairings the clients actually use.

    python3 build/check_contrast.py

Reads tokens/color.json, so it stays true when a value changes. WCAG 2.2 AA:
normal text 4.5:1, large text 3:1, UI boundaries 3:1.
"""
import json, pathlib, sys, re

TOKENS = json.loads((pathlib.Path(__file__).resolve().parents[1] / "tokens/color.json").read_text())

def flat(node, out, prefix=""):
    for k, v in node.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict):
            flat(v, out, f"{prefix}{k}.")
        elif isinstance(v, str) and (v.startswith("#") or v.startswith("{")):
            out[f"{prefix}{k}"] = v
    return out

RAW = flat({k: v for k, v in TOKENS.items() if k != "gradient"}, {})

def resolve(value):
    m = re.fullmatch(r"\{([^}]+)\}", value)
    return resolve(RAW[m.group(1)]) if m else value

def lum(hex_):
    c = [int(hex_.lstrip("#")[i:i+2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def get(name):
    return resolve(RAW[name])

WHITE = "#FFFFFF"
PAIRS = [
    ("body text on app background",  get("neutral.800"), get("neutral.50"),  4.5),
    ("body text on white",           get("neutral.800"), WHITE,             4.5),
    ("muted text on white",          get("neutral.500"), WHITE,             4.5),
    ("secondary text on white",      get("neutral.600"), WHITE,             4.5),
    ("text on gold button",          get("surface.onGold"), get("brand.gold500"), 4.5),
    ("white on gold button",         WHITE,              get("brand.gold500"), 4.5),
    ("gold500 as TEXT on white",     get("brand.gold500"), WHITE,           4.5),
    ("gold600 as TEXT on white",     get("brand.gold600"), WHITE,           4.5),
    ("gold700 as TEXT on white",     get("brand.gold700"), WHITE,           4.5),
    ("danger text on white",         get("semantic.danger"), WHITE,         4.5),
    ("success text on white",        get("semantic.success"), WHITE,        4.5),
    ("card border on white",         get("neutral.200"), WHITE,             3.0),
    ("chip info",                    get("chip.info.fg"), get("chip.info.bg"), 4.5),
    ("chip success",                 get("chip.success.fg"), get("chip.success.bg"), 4.5),
    ("chip warning",                 get("chip.warning.fg"), get("chip.warning.bg"), 4.5),
    ("chip danger",                  get("chip.danger.fg"), get("chip.danger.bg"), 4.5),
]

fails = []
print(f"{'pairing':<30} {'fg':<9} {'bg':<9} {'ratio':>7}  need   verdict")
for label, fg, bg, need in PAIRS:
    r = ratio(fg, bg)
    ok = r >= need
    if not ok:
        fails.append((label, r, need))
    print(f"{label:<30} {fg:<9} {bg:<9} {r:>6.2f}:1  {need:>4}  {'PASS' if ok else 'FAIL'}")

print()
if fails:
    print("Below threshold (each must be a deliberate, documented use):")
    for label, r, need in fails:
        print(f"  - {label}: {r:.2f}:1 (needs {need})")
sys.exit(0)
