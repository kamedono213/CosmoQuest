from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "public" / "icons"
SPLASH_DIR = ROOT / "public" / "splash"


def font(size: int, bold: bool = False):
    family = "seguisb.ttf" if bold else "segoeui.ttf"
    try:
        return ImageFont.truetype(f"C:/Windows/Fonts/{family}", size)
    except OSError:
        return ImageFont.load_default()


def draw_mark(size: int, maskable: bool = False) -> Image.Image:
    scale = 4
    canvas = Image.new("RGB", (size * scale, size * scale), "#081229")
    draw = ImageDraw.Draw(canvas)
    radius = size * scale * (0.18 if maskable else 0.24)
    inset = size * scale * (0.2 if maskable else 0.12)
    cx = cy = size * scale / 2
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill="#65d6ff")
    draw.arc(
        (inset, cy - size * scale * 0.12, size * scale - inset, cy + size * scale * 0.24),
        8,
        172,
        fill="#ffcb68",
        width=max(4, int(size * scale * 0.065)),
    )
    glint = size * scale * 0.05
    gx, gy = cx + radius * 0.42, cy - radius * 0.5
    draw.ellipse((gx - glint, gy - glint, gx + glint, gy + glint), fill="#ffffff")
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def draw_splash(width: int, height: int) -> Image.Image:
    image = Image.new("RGB", (width, height), "#050b1c")
    draw = ImageDraw.Draw(image)
    for radius, color in (
        (int(width * 0.68), "#081229"),
        (int(width * 0.47), "#102550"),
        (int(width * 0.29), "#17356a"),
    ):
        cx, cy = width // 2, int(height * 0.35)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)

    mark_size = int(min(width, height) * 0.22)
    mark = draw_mark(mark_size)
    image.paste(mark, ((width - mark_size) // 2, int(height * 0.29) - mark_size // 2))

    title_font = font(max(32, int(width * 0.075)), bold=True)
    subtitle_font = font(max(18, int(width * 0.03)))
    title = "COSMO QUEST"
    subtitle = "EXPLORE  •  LEARN  •  DISCOVER"
    title_box = draw.textbbox((0, 0), title, font=title_font)
    subtitle_box = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    draw.text(((width - (title_box[2] - title_box[0])) / 2, height * 0.47), title, font=title_font, fill="#ffffff")
    draw.text(((width - (subtitle_box[2] - subtitle_box[0])) / 2, height * 0.53), subtitle, font=subtitle_font, fill="#b9cbed")
    return image


ICON_DIR.mkdir(parents=True, exist_ok=True)
SPLASH_DIR.mkdir(parents=True, exist_ok=True)

draw_mark(192).save(ICON_DIR / "icon-192.png", optimize=True)
draw_mark(512).save(ICON_DIR / "icon-512.png", optimize=True)
for icon_size in (72, 96, 128, 144, 256, 384):
    draw_mark(icon_size).save(ICON_DIR / f"icon-{icon_size}.png", optimize=True)
draw_mark(192, maskable=True).save(ICON_DIR / "icon-maskable-192.png", optimize=True)
draw_mark(512, maskable=True).save(ICON_DIR / "icon-maskable-512.png", optimize=True)
draw_mark(180).save(ICON_DIR / "apple-touch-icon.png", optimize=True)
draw_mark(64).save(ROOT / "public" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

for splash_size in (
    (1170, 2532),
    (1179, 2556),
    (1206, 2622),
    (1290, 2796),
    (1320, 2868),
    (1640, 2360),
    (1668, 2388),
    (2048, 2732),
):
    width, height = splash_size
    draw_splash(width, height).save(
        SPLASH_DIR / f"apple-splash-{width}x{height}.png",
        optimize=True,
    )
