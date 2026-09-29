# hello-iam-sy.github.io

Portfolio site of Suyeong Kim, served by GitHub Pages at https://hello-iam-sy.github.io.

Plain static HTML/CSS, no build step (`.nojekyll` turns off Jekyll).

| Path | Page |
| --- | --- |
| `index.html` | Home: projects, experience, skills, contact |
| `projects/ev-platform/` | NSW EV Charger Data Platform: interactive demo on a Gold-layer snapshot |
| `projects/edu-sv/` | Answer-leak control for LLM tutors: case study |
| `assets/` | Shared stylesheet and images |

Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000.

Refresh the EV demo data: in the DE-on-premise project run
`uv run python scripts/export_portfolio.py`, then copy `apps/portfolio/data/` to `projects/ev-platform/data/`.
