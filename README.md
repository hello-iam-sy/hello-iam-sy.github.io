# hello-iam-sy.github.io

Portfolio site of Suyeong Kim, served by GitHub Pages at https://hello-iam-sy.github.io.

Plain static HTML/CSS, no build step (`.nojekyll` turns off Jekyll).

| Path | Page |
| --- | --- |
| `index.html` | Home: projects, experience, skills, contact |
| `projects/ev-platform/` | NSW EV Charger Data Platform: interactive demo on a Gold-layer snapshot |
| `projects/edu-sv/` | Answer-leak control for LLM tutors: case study |
| `projects/examprepbot/` | ExamPrepBot: architecture, engineering decisions and a browser for 42 saved practice questions |
| `assets/` | Shared stylesheet and images |

Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000.

Refresh the EV demo data: in the DE-on-premise project run
`uv run python scripts/export_portfolio.py`, then copy `apps/portfolio/data/` to `projects/ev-platform/data/`.

The ExamPrepBot demo uses a reduced snapshot of `ExamPrepBot/seed/comp5339.json`
(11 October 2026), preserving the generated question/answer text and referenced
page metadata. It runs entirely in the browser, with images of the 61 cited PDF
pages and a full-size view. It does not generate new answers or bundle full PDFs.
Preview at http://localhost:8000/projects/examprepbot/.

To regenerate the slide previews with the ExamPrepBot environment's PyMuPDF:

```sh
../ExamPrepBot/.venv/bin/python projects/examprepbot/export_slides.py ../ExamPrepBot/courses/comp5339
```
