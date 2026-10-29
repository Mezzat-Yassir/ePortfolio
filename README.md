# Mohamed Yassir Mezzat — ePortfolio

Live site: https://mezzat-yassir.github.io/ePortfolio/

A single-page website rebuilt from the Canva ePortfolio. Every section of the design is a section of the page:
scroll through it, or use the sidebar tabs to jump to a section.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All the content |
| `assets/css/style.css` | Styles (desktop layout follows the original 1440 × 810 design; phones and tablets get a stacked layout) |
| `assets/js/main.js` | Tabs, smooth scrolling, sticky header, mobile menu |
| `assets/img/`, `assets/svg/` | Photos, logos and icons taken from the design |
| `assets/fonts/` | Free web fonts standing in for Aptos (Hanken Grotesk), The Seasons (Newsreader) and Times New Roman MT Pro (Tinos) |

## Adding the video (section "A little more about me")

1. Either upload the file to `assets/video/` (keep it well under GitHub's 100 MB limit) or upload it to YouTube / Google Drive.
2. In `index.html`, find the comment that starts with `VIDEO:` and replace the `<svg class="play">…</svg>` element below it with:
   - a file: `<video src="assets/video/your-video.mp4" controls playsinline preload="metadata"></video>`
   - or an embed: `<iframe src="EMBED-LINK" allowfullscreen></iframe>`
3. On the same `<div class="card video-frame …">`, remove `role="img"` and `aria-label="Video placeholder"`.

The video automatically fills the rounded frame.

Pushing to the `main` branch republishes the site within a minute or two.
