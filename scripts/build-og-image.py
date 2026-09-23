#!/usr/bin/env python3
"""
Génère l'image de partage social (og-image) au bon format.

    /usr/bin/python3 scripts/build-og-image.py

Pourquoi ce script existe
-------------------------
Le fichier `public/og-image.png` faisait 1024x1536 — un portrait — alors que le
HTML déclarait 1200x630. Les plateformes recadrent sur les dimensions
déclarées : la tête et les pieds du personnage étaient coupés, et la carte
s'affichait de travers. Un fichier binaire ne se relit pas : sans script, la
prochaine régénération reproduirait l'erreur.

Format : 1200x630, la recommandation commune à Facebook, LinkedIn, X et
WhatsApp. C'est le seul format que toutes respectent sans recadrage.

Composition : le pixel-art est un portrait, il ne peut pas remplir un cadre
paysage sans être étiré. Il est donc posé à droite, à hauteur complète, sur le
fond du site. Le texte occupe la gauche — c'est ce qui reste lisible en petit
dans un fil.

Prérequis : Pillow, sur le Python système de macOS (`/usr/bin/python3`).
Lancé à la main ; les fichiers produits sont committés et le build n'en dépend
jamais.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
# Le pixel-art d'origine, conservé à part : sans cela, la première exécution
# écraserait la source et le script ne pourrait plus tourner deux fois.
SOURCE = ROOT / "public" / "og-image-source.png"
OUT_PNG = ROOT / "public" / "og-image.png"
OUT_TEMP = ROOT / "public" / "og-image.tmp.png"

WIDTH, HEIGHT = 1200, 630

# Couleurs du site (tailwind.config.js)
BG = (255, 255, 255)
TEXT = (45, 107, 107)       # os-text
BODY = (69, 120, 120)       # os-body
BORDER = (208, 224, 224)    # os-border

PADDING = 72

# Polices système : le script doit tourner sans installer quoi que ce soit.
# Syne n'est pas disponible localement, une sans-serif sobre fait l'affaire —
# l'image n'est pas la page, seule la lisibilité compte.
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"


def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Source introuvable : {SOURCE}")

    source = Image.open(SOURCE).convert("RGBA")

    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(canvas)

    # --- Pixel-art, à droite, à hauteur complète -----------------------
    # Marge de 24 px en haut et en bas : le personnage ne touche pas les bords,
    # sinon une plateforme qui recadre légèrement rogne les pieds.
    art_height = HEIGHT - 48
    art_width = round(source.width * art_height / source.height)
    art = source.resize((art_width, art_height), Image.LANCZOS)
    canvas.paste(art, (WIDTH - art_width - 24, 24), art)

    # --- Bloc de texte, à gauche --------------------------------------
    text_width = WIDTH - art_width - PADDING * 2 - 24

    font_name = load_font(FONT_BOLD, 52)
    font_role = load_font(FONT_REGULAR, 26)
    font_site = load_font(FONT_BOLD, 22)

    y = PADDING + 40

    draw.text((PADDING, y), "Jean-David", font=font_name, fill=TEXT)
    y += 62
    draw.text((PADDING, y), "Zamblezie", font=font_name, fill=TEXT)
    y += 86

    # Filet de séparation, comme sur le site.
    draw.rectangle([PADDING, y, PADDING + 56, y + 3], fill=TEXT)
    y += 34

    for line in ["Développeur web spécialisé en", "automatisation IA et ingénierie agentique"]:
        draw.text((PADDING, y), line, font=font_role, fill=BODY)
        y += 36

    # Adresse en bas, alignée sur la marge basse.
    draw.text((PADDING, HEIGHT - PADDING - 22), "zamblezie.fr", font=font_site, fill=TEXT)

    # Bordure discrète : certaines plateformes posent la carte sur un fond de
    # couleur proche du blanc, et sans bord l'image se fondrait dedans.
    draw.rectangle([0, 0, WIDTH - 1, HEIGHT - 1], outline=BORDER, width=2)

    # Écriture via un fichier temporaire : si le script s'interrompt, l'ancienne
    # image de partage reste en place plutôt que d'être laissée tronquée.
    canvas.save(OUT_TEMP, "PNG", optimize=True)
    OUT_TEMP.replace(OUT_PNG)

    result = Image.open(OUT_PNG)
    print(f"og-image.png — {result.width}x{result.height} ({OUT_PNG.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
