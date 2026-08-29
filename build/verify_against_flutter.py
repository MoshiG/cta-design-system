"""Prove the generated Dart tokens still equal the values the Flutter app uses today.

    python3 build/verify_against_flutter.py [path/to/app_theme.dart]

This is the M9c acceptance gate and the M9f regression check. It is not part of CI:
CI here only proves dist/ is current, because the cta-app checkout is not available
to this repo's workflow. Run it by hand whenever tokens change, until M9f makes the
Flutter app consume this package directly and its own tests take over.
"""
import re, pathlib, sys

DEFAULT_SRC = pathlib.Path(__file__).resolve().parents[2] / "cta_app/mobile/lib/theme/app_theme.dart"
SRC = pathlib.Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SRC
GEN = pathlib.Path(__file__).resolve().parents[1] / "dist/dart/lib/app_tokens.dart"

if not SRC.exists():
    sys.exit(f"app_theme.dart not found at {SRC} — pass its path as an argument.")
src, gen = SRC.read_text(), GEN.read_text()

def colors(text):
    """name -> 0xFFRRGGBB, resolving `static const a = b;` aliases."""
    out, alias = {}, {}
    for name, val in re.findall(r"static const (\w+) = Color\((0x[0-9A-Fa-f]{8})\);", text):
        out[name] = val.upper()
    for name, ref in re.findall(r"static const (\w+) = (\w+);", text):
        alias[name] = ref
    for name, ref in alias.items():
        if ref in out:
            out[name] = out[ref]
    return out

def doubles(text, cls):
    body = re.search(r"class %s \{(.*?)\n\}" % cls, text, re.S)
    if not body:
        return {}
    return {n: float(v) for n, v in re.findall(r"static const double (\w+) = ([\d.]+);", body.group(1))}

def radii(text):
    return {n: float(v) for n, v in re.findall(r"static const Radius (\w+) = Radius\.circular\(([\d.]+)\);", text)}

def src_textstyles(text):
    out = {}
    for name, kind, args in re.findall(r"static TextStyle get (\w+) => _(display|body)\(([^)]*)\);", text):
        parts = [p.strip() for p in args.split(",")]
        size = float(parts[0])
        weight = 700 if kind == "display" else 400
        height = 1.2 if kind == "display" else 1.5
        for p in parts[1:]:
            if p.startswith("w:"):
                weight = int(re.search(r"w(\d+)", p).group(1))
            elif p.startswith("h:"):
                height = float(p.split(":")[1])
        out[name] = (kind, size, weight, height)
    return out

def gen_texttokens(text):
    out = {}
    for name, fam, size, weight, lh in re.findall(
        r"static const (\w+) = AppTextToken\(\s*family: AppFontFamily\.(\w+),\s*size: ([\d.]+),\s*weight: (\d+),\s*lineHeight: ([\d.]+),",
        text):
        out[name] = (fam, float(size), int(weight), float(lh))
    return out

def compare(label, a, b, ignore=()):
    diffs = []
    for k in sorted(set(a) | set(b)):
        if k in ignore:
            continue
        if k not in a:
            diffs.append(f"  {k}: missing in app_theme.dart, generated={b[k]}")
        elif k not in b:
            diffs.append(f"  {k}: present in app_theme.dart ({a[k]}) but NOT generated")
        elif a[k] != b[k]:
            diffs.append(f"  {k}: app_theme={a[k]}  generated={b[k]}")
    print(f"{label}: {len(a)} in app_theme, {len(b)} generated -> {'IDENTICAL' if not diffs else str(len(diffs)) + ' DIFFERENCE(S)'}")
    for d in diffs:
        print(d)
    return diffs

fails = []
fails += compare("AppColors", colors(src), colors(gen))
fails += compare("AppSpacing", doubles(src, "AppSpacing"), doubles(gen, "AppSpacing"))
fails += compare("AppRadii", radii(src), radii(gen))

s_ts, g_ts = src_textstyles(src), gen_texttokens(gen)
fails += compare("Type scale", s_ts, g_ts)

# gradients: compare the literal colour lists and stops
def grads(text):
    return {
        "goldGradient": re.search(r"goldGradient = LinearGradient\((.*?)\);", text, re.S).group(1),
        "splashRadial": re.search(r"splashRadial = RadialGradient\((.*?)\);", text, re.S).group(1),
    }
def norm(block, cmap):
    block = re.sub(r"\s+", " ", block).strip()
    for name, val in sorted(cmap.items(), key=lambda kv: -len(kv[0])):
        block = re.sub(rf"\b{name}\b", f"Color({val})", block)
    block = re.sub(r"(?<![\w.])(\d+\.\d+|\d+)(?![\w.])", lambda m: f"{float(m.group(1)):g}", block)
    return block.replace("0X", "0x")
sg, gg = grads(src), grads(gen)
sc, gc = colors(src), colors(gen)
for k in sg:
    a, b = norm(sg[k], sc), norm(gg[k], gc)
    ok = a == b
    print(f"Gradient {k}: {'IDENTICAL' if ok else 'DIFFERENT'}")
    if not ok:
        print(f"  app_theme: {a}\n  generated: {b}")
        fails.append(k)

print()
print("RESULT:", "all generated tokens are value-identical to app_theme.dart" if not fails else f"{len(fails)} difference(s) — NOT identical")
sys.exit(1 if fails else 0)
