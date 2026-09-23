#!/usr/bin/env python3
"""
Génère les favicons du site depuis le logo.

    /usr/bin/python3 scripts/build-favicons.py

Pourquoi ce script existe
-------------------------
Les favicons de `public/` sont des fichiers binaires : sans script, on ne sait
plus comment ils ont été produits. La transparence en a fait les frais — elle a
été perdue lors d'une génération manuelle, et personne ne pouvait le voir en
lisant le dépôt. Ce script rend la décision explicite et rejouable.

Transparence : laquelle, où, et pourquoi
----------------------------------------
Deux familles de fichiers, deux traitements, pour une raison précise.

- favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon.png
  → TRANSPARENTS. Le navigateur compose le favicon sur le fond de sa propre
    barre d'onglets. Transparent, il s'y intègre ; avec un fond blanc figé, il
    produit un carré blanc sur une barre sombre — plus visible que le logo
    lui-même.

- apple-touch-icon.png
  → FOND BLANC OPAQUE. iOS n'affiche jamais la transparence : il compose
    l'icône sur du noir. Le logo (bleu sarcelle) y deviendrait illisible. Le
    fond blanc est donc ici un choix, pas un oubli.

Prérequis : Pillow, disponible sur le Python système de macOS (`/usr/bin/python3`).
Le script ne tourne qu'à la main, sur la machine de développement — les fichiers
produits sont committés, le build n'en dépend jamais.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src" / "assets" / "Img" / "logo.png"
OUT = ROOT / "public"

# Tailles des favicons transparents (nom de fichier → côté en pixels)
TRANSPARENT = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon.png": 48,
}

# Résolutions embarquées dans le .ico multi-résolution
ICO_SIZES = [(16, 16), (32, 32), (48, 48)]

# Icône iOS : fond opaque, voir l'en-tête
APPLE_SIZE = 180

# Interpolation de haute qualité pour une réduction propre : un logo réduit de
# 192 px à 16 px sans rééchantillonnage correct devient une bouillie de pixels.
RESAMPLE = Image.LANCZOS


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Source introuvable : {SOURCE}")

    source = Image.open(SOURCE).convert("RGBA")
    OUT.mkdir(parents=True, exist_ok=True)

    print(f"source : {SOURCE.relative_to(ROOT)} ({source.width}x{source.height})")

    # 1. Favicons transparents
    for name, size in TRANSPARENT.items():
        icon = source.resize((size, size), RESAMPLE)
        icon.save(OUT / name)
        print(f"  {name.ljust(22)} {size}x{size}  transparent")

    # 2. favicon.ico multi-résolution. Pillow rééchantillonne depuis la plus
    #    grande taille fournie, et conserve l'alpha (colortype 6).
    source.resize((256, 256), RESAMPLE).save(
        OUT / "favicon.ico", sizes=ICO_SIZES
    )
    print(f"  {'favicon.ico'.ljust(22)} {len(ICO_SIZES)} tailles  transparent")

    # 3. Icône iOS : aplatissement sur blanc, sans canal alpha
    canvas = Image.new("RGBA", (APPLE_SIZE, APPLE_SIZE), (255, 255, 255, 255))
    canvas.alpha_composite(source.resize((APPLE_SIZE, APPLE_SIZE), RESAMPLE))
    canvas.convert("RGB").save(OUT / "apple-touch-icon.png")
    print(f"  {'apple-touch-icon.png'.ljust(22)} {APPLE_SIZE}x{APPLE_SIZE}  fond blanc opaque")

    # 4. Vérification : le script relit ce qu'il vient d'écrire plutôt que de
    #    supposer que la bibliothèque s'est comportée comme prévu.
    print("\nvérification :")
    for name in (*TRANSPARENT, "favicon.ico", "apple-touch-icon.png"):
        path = OUT / name
        icon = Image.open(path)
        alpha = "A" in icon.mode
        print(f"  {name.ljust(22)} {icon.mode.ljust(6)} alpha={alpha}")


if __name__ == "__main__":
    main()
