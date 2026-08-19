from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from pypdf import PdfReader


REDACTIONS: dict[str, list[tuple[float, float, float, float]]] = {
    "28_Mohammad Raihan Hadriansyah Prasetya.jpg": [(0.0, 0.84, 1.0, 1.0)],
    "Sertif Panitia OM 2024.pdf": [(0.0, 0.84, 1.0, 1.0)],
    "Sertifikat Peserta Seminar SIGMA 2024 - Mohammad Raihan Hadriansyah Prasetya.pdf": [(0.0, 0.84, 1.0, 1.0)],
    "Sertifikat Workshop Siskom 1.jpg": [(0.0, 0.84, 1.0, 1.0)],
    "Sertifikat YEC 2024.png": [(0.0, 0.84, 1.0, 1.0)],
    "Sertifikat_Relationship_Management.pdf": [(0.56, 0.80, 0.96, 0.98)],
    "Sertifikat_Self_Management.pdf": [(0.56, 0.80, 0.96, 0.98)],
    "Sertifikat_Technopreneurship.pdf": [(0.56, 0.80, 0.96, 0.98)],
}

PREFERRED_DUPLICATE_NAMES = {"Dicoding_DevCoach.pdf"}


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def choose_unique(files: list[Path]) -> tuple[list[Path], list[list[str]]]:
    groups: dict[str, list[Path]] = defaultdict(list)
    for path in files:
        groups[sha256(path)].append(path)

    unique: list[Path] = []
    duplicates: list[list[str]] = []
    for group in groups.values():
        ordered = sorted(
            group,
            key=lambda path: (
                path.name not in PREFERRED_DUPLICATE_NAMES,
                len(path.name),
                path.name.lower(),
            ),
        )
        unique.append(ordered[0])
        if len(ordered) > 1:
            duplicates.append([path.name for path in ordered])
    return sorted(unique, key=lambda path: path.name.lower()), duplicates


def render_pdf_first_page(path: Path, output_prefix: Path, pdftoppm: str) -> Path:
    subprocess.run(
        [
            pdftoppm,
            "-f",
            "1",
            "-singlefile",
            "-png",
            "-scale-to",
            "2200",
            str(path),
            str(output_prefix),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    rendered = output_prefix.with_suffix(".png")
    if not rendered.exists():
        raise FileNotFoundError(f"Missing rendered page for {path.name}")
    return rendered


def extract_first_page_text(path: Path) -> str:
    if path.suffix.lower() != ".pdf":
        return ""
    try:
        reader = PdfReader(str(path), strict=False)
        return (reader.pages[0].extract_text() or "").strip()
    except Exception:
        return ""


def privacy_blur(image: Image.Image, rect: tuple[float, float, float, float]) -> None:
    width, height = image.size
    box = (
        max(0, int(rect[0] * width)),
        max(0, int(rect[1] * height)),
        min(width, int(rect[2] * width)),
        min(height, int(rect[3] * height)),
    )
    region = image.crop(box)
    small_width = max(12, region.width // 42)
    small_height = max(8, region.height // 42)
    pixelated = region.resize((small_width, small_height), Image.Resampling.BILINEAR)
    pixelated = pixelated.resize(region.size, Image.Resampling.NEAREST)
    softened = pixelated.filter(ImageFilter.GaussianBlur(radius=max(2, image.width // 500)))
    image.paste(softened, box)


def prepare_image(source: Path, rendered: Path | None, max_width: int) -> Image.Image:
    input_path = rendered if rendered is not None else source
    with Image.open(input_path) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
    if image.width > max_width:
        target_height = round(image.height * max_width / image.width)
        image = image.resize((max_width, target_height), Image.Resampling.LANCZOS)
    for rect in REDACTIONS.get(source.name, []):
        privacy_blur(image, rect)
    return image


def create_contact_sheets(items: list[dict], output_dir: Path) -> list[str]:
    columns, rows = 3, 3
    tile_width, tile_height, label_height, margin = 560, 430, 58, 18
    sheet_width = columns * tile_width + (columns + 1) * margin
    sheet_height = rows * (tile_height + label_height) + (rows + 1) * margin
    font = ImageFont.load_default(size=18)
    sheet_names: list[str] = []

    for sheet_number, start in enumerate(range(0, len(items), columns * rows), start=1):
        batch = items[start:start + columns * rows]
        sheet = Image.new("RGB", (sheet_width, sheet_height), "#181818")
        draw = ImageDraw.Draw(sheet)
        for index, item in enumerate(batch):
            row, column = divmod(index, columns)
            x = margin + column * tile_width
            y = margin + row * (tile_height + label_height)
            with Image.open(item["preview_path"]) as opened:
                preview = opened.convert("RGB")
            preview.thumbnail((tile_width - 12, tile_height - 12), Image.Resampling.LANCZOS)
            tile = Image.new("RGB", (tile_width, tile_height), "white")
            tile.paste(preview, ((tile_width - preview.width) // 2, (tile_height - preview.height) // 2))
            sheet.paste(tile, (x, y))
            label = item["source_name"]
            if len(label) > 58:
                label = label[:55] + "..."
            draw.text((x + 4, y + tile_height + 8), label, fill="white", font=font)
        filename = f"contact-sheet-{sheet_number:02d}.jpg"
        sheet.save(output_dir / filename, quality=88, optimize=True)
        sheet_names.append(filename)
    return sheet_names


def main() -> None:
    parser = argparse.ArgumentParser(description="Create privacy-safe certificate previews.")
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--audit-output", required=True, type=Path)
    parser.add_argument("--pdftoppm", default=shutil.which("pdftoppm") or "pdftoppm")
    parser.add_argument("--max-width", type=int, default=1600)
    args = parser.parse_args()

    supported = {".pdf", ".jpg", ".jpeg", ".png"}
    all_files = sorted(
        (path for path in args.source.rglob("*") if path.is_file() and path.suffix.lower() in supported),
        key=lambda path: path.name.lower(),
    )
    unique_files, duplicate_groups = choose_unique(all_files)
    args.output.mkdir(parents=True, exist_ok=True)
    args.audit_output.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    with tempfile.TemporaryDirectory(prefix="reyy-certificate-render-") as temp:
        temp_dir = Path(temp)
        for index, source in enumerate(unique_files, start=1):
            rendered = None
            if source.suffix.lower() == ".pdf":
                rendered = render_pdf_first_page(source, temp_dir / f"cert-{index:03d}", args.pdftoppm)
            image = prepare_image(source, rendered, args.max_width)
            output_name = f"{slugify(source.stem)}.webp"
            output_path = args.output / output_name
            image.save(output_path, "WEBP", quality=84, method=6)
            manifest.append({
                "source_name": source.name,
                "source_relative": source.relative_to(args.source).as_posix(),
                "preview": f"/certificates/previews/{output_name}",
                "preview_path": str(output_path),
                "width": image.width,
                "height": image.height,
                "redacted": source.name in REDACTIONS,
                "first_page_text": extract_first_page_text(source),
            })

    contact_sheets = create_contact_sheets(manifest, args.audit_output)
    audit_manifest = {
        "source_count": len(all_files),
        "unique_count": len(unique_files),
        "duplicate_groups": duplicate_groups,
        "contact_sheets": contact_sheets,
        "items": [{key: value for key, value in item.items() if key != "preview_path"} for item in manifest],
    }
    (args.audit_output / "manifest.json").write_text(
        json.dumps(audit_manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps({
        "source_count": len(all_files),
        "unique_count": len(unique_files),
        "redacted_count": sum(item["redacted"] for item in manifest),
        "preview_size_mb": round(sum(path.stat().st_size for path in args.output.glob("*.webp")) / 1024 / 1024, 2),
        "contact_sheets": len(contact_sheets),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
