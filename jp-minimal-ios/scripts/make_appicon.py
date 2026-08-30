"""Regenerate AppIcon.png from the Android JP vector, with 18% Springboard inset."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[1] / "JPMinimal" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon.png"
W = 1024
INK = (17, 17, 17)
GOLD = (198, 168, 124)


def cubic(p0, p1, p2, p3, n=48):
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def main():
    scale = W * 0.64 / 108.0
    ox = oy = W * 0.18

    def T(pts):
        return [(ox + x * scale, oy + y * scale) for x, y in pts]

    j = [(44, 34), (52, 34), (52, 64)]
    j += cubic((52, 64), (52, 71), (46.5, 75), (38, 75))[1:]
    j += [(34, 75), (34, 68), (38, 68)]
    j += cubic((38, 68), (43, 68), (46, 66), (46, 64))[1:]
    j.append((46, 34))

    p_outer = [(56, 34), (72, 34)]
    p_outer += cubic((72, 34), (80, 34), (85, 40), (85, 46.5))[1:]
    p_outer += cubic((85, 46.5), (85, 53), (80, 59), (72, 59))[1:]
    p_outer += [(64, 59), (64, 74), (56, 74)]

    p_hole = [(64, 41), (72, 41)]
    p_hole += cubic((72, 41), (75.8, 41), (78.5, 43.6), (78.5, 46.5))[1:]
    p_hole += cubic((78.5, 46.5), (78.5, 49.4), (75.8, 52), (72, 52))[1:]
    p_hole.append((64, 52))

    overlay = Image.new("L", (W, W), 0)
    od = ImageDraw.Draw(overlay)
    od.polygon(T(j), fill=255)
    od.polygon(T(p_outer), fill=255)
    od.polygon(T(p_hole), fill=0)

    gold = Image.new("RGB", (W, W), GOLD)
    ink = Image.new("RGB", (W, W), INK)
    out = Image.composite(gold, ink, overlay)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, "PNG")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
