"""Validate API contract + local fixtures. Does not compile Swift (no Xcode on Windows)."""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = "https://jp-moda-minimalista.onrender.com"
PALETTE = {
    "Ink": "#111111",
    "InkSoft": "#1C1C1C",
    "Paper": "#FAFAF7",
    "Sand": "#F3F0E9",
    "Gold": "#C6A87C",
    "GoldDark": "#A88758",
    "GoldLight": "#E5D8BF",
    "Mist": "#7A7A74",
    "Line": "#E9E5DC",
    "Error": "#8B2E3A",
}
CARD_KEYS = {
    "id", "slug", "name", "price", "compareAtPrice", "discountPct", "visual",
    "colorHex", "categoryName", "categorySlug", "inStock", "sizes",
}
PRODUCT_KEYS = CARD_KEYS | {"sku", "description", "categoryId", "stock", "featured", "colors"}
EMOJI = {
    "tee": "👕", "shirt": "👔", "pants": "👖", "shorts": "🩳", "sweater": "🧶",
    "cardigan": "🧥", "jacket": "🧥", "coat": "🧥", "blazer": "🤵", "dress": "👗",
    "sneaker": "👟", "loafer": "👞", "bag": "👜", "belt": "🪢", "cap": "🧢",
    "wallet": "👛", "watch": "⌚",
}


def fail(msg: str) -> None:
    print("FAIL:", msg)
    sys.exit(1)


def get(path: str, timeout: int = 60):
    url = API + path
    with urllib.request.urlopen(url, timeout=timeout) as res:
        return json.loads(res.read().decode())


def post(path: str, body: dict, timeout: int = 60):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return json.loads(res.read().decode())


def main() -> None:
    palette_src = (ROOT / "JPMinimal" / "Theme" / "Palette.swift").read_text(encoding="utf-8")
    for name, hexv in PALETTE.items():
        if hexv.lower() not in palette_src.lower() and hexv.upper() not in palette_src:
            fail(f"palette {name} {hexv} missing from Palette.swift")

    emoji_src = (ROOT / "JPMinimal" / "Visual" / "ProductEmoji.swift").read_text(encoding="utf-8")
    for key, glyph in EMOJI.items():
        if f'"{key}"' not in emoji_src:
            fail(f"emoji key {key} missing")
        if glyph not in emoji_src:
            fail(f"emoji glyph {glyph} missing")

    money = (ROOT / "JPMinimal" / "Util" / "Money.swift").read_text(encoding="utf-8")
    if "299" not in money or "24.90" not in money:
        fail("shipping rules missing")

    info = (ROOT / "JPMinimal" / "Info.plist").read_text(encoding="utf-8")
    if "API_BASE_URL" not in info:
        fail("Info.plist missing API_BASE_URL")
    if "10.0.2.2" in info:
        fail("emulator IP leaked into Info.plist")

    xc = (ROOT / "Config" / "Production.xcconfig").read_text(encoding="utf-8")
    if "jp-moda-minimalista.onrender.com" not in xc:
        fail("xcconfig missing production URL")
    if "10.0.2.2" in xc:
        fail("emulator IP leaked into xcconfig")

    icon = ROOT / "JPMinimal" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon.png"
    if not icon.exists() or icon.stat().st_size < 1000:
        fail("AppIcon.png missing")

    swift_files = list((ROOT / "JPMinimal").rglob("*.swift"))
    if len(swift_files) < 18:
        fail(f"too few Swift files: {len(swift_files)}")
    joined = "\n".join(p.read_text(encoding="utf-8") for p in swift_files)
    if "10.0.2.2" in joined:
        fail("emulator IP leaked into Swift")
    if "Alamofire" in joined or "WKWebView" in joined:
        fail("forbidden dependency")

    print("local files ok")

    health = get("/api/health")
    if health.get("ok") is not True or health.get("service") != "jp-store-api":
        fail(f"health unexpected: {health}")
    print("health", health)

    cats = get("/api/categories")
    if not cats.get("categories"):
        fail("no categories")
    print("categories", len(cats["categories"]))

    featured = get("/api/products/featured?limit=2")
    if not featured.get("products"):
        fail("no featured")
    card = featured["products"][0]
    missing = CARD_KEYS - set(card)
    if missing:
        fail(f"featured card missing keys {missing}")

    slug = card["slug"]
    product = get(f"/api/products/{slug}")["product"]
    missing_p = {"id", "slug", "name", "price", "visual", "colors", "sizes", "stock"} - set(product)
    if missing_p:
        fail(f"product missing {missing_p}")
    print("product", product["name"])

    auth = post("/api/auth/login", {"email": "demo@jpstore.com.br", "password": "demo1234"})
    if not auth.get("token") or not auth.get("user"):
        fail(f"login unexpected: {auth}")
    print("login", auth["user"]["email"])

    fixtures = ROOT / "fixtures"
    fixtures.mkdir(exist_ok=True)
    (fixtures / "health.json").write_text(json.dumps(health, indent=2), encoding="utf-8")
    (fixtures / "categories.json").write_text(json.dumps(cats, indent=2), encoding="utf-8")
    (fixtures / "featured.json").write_text(json.dumps(featured, indent=2), encoding="utf-8")
    (fixtures / "product.json").write_text(json.dumps({"product": product}, indent=2), encoding="utf-8")
    (fixtures / "login.json").write_text(
        json.dumps({"token": "<redacted>", "user": auth["user"]}, indent=2),
        encoding="utf-8",
    )
    print("fixtures saved")
    print("OK")


if __name__ == "__main__":
    main()
