"""Render only the pages cited by the portfolio's saved question set."""

import argparse
import hashlib
import json
from contextlib import ExitStack
from pathlib import Path

import pymupdf


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("course_dir", type=Path, help="Directory containing weekNN course PDFs")
    args = parser.parse_args()
    course_dir = args.course_dir.resolve()
    project = Path(__file__).resolve().parent
    snapshot = project / "data/questions.json"
    data = json.loads(snapshot.read_text())

    with ExitStack() as stack:
        documents = {}
        # Validate every reference before writing any output.
        for label, page in data["pages"].items():
            source = (course_dir / page["source"]).resolve()
            if not source.is_relative_to(course_dir):
                raise ValueError(f"Source escapes the course directory: {label}")
            if source not in documents:
                documents[source] = stack.enter_context(pymupdf.open(source))
            if not 1 <= page["page"] <= len(documents[source]):
                raise ValueError(f"Invalid PDF page: {label}")

        output = project / "data/slides"
        output.mkdir(parents=True, exist_ok=True)
        for page in data["pages"].values():
            source = (course_dir / page["source"]).resolve()
            name = hashlib.sha256(page["source"].encode()).hexdigest()[:12]
            relative = f"data/slides/{name}-p{page['page']}.png"
            pixmap = documents[source][page["page"] - 1].get_pixmap(dpi=144, alpha=False)
            pixmap.save(project / relative)
            page.update(image=relative, width=pixmap.width, height=pixmap.height)

    snapshot.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Rendered {len(data['pages'])} cited pages to {output}")


if __name__ == "__main__":
    main()
