# Mohamed Yassir Mezzat — ePortfolio

Live site: https://mezzat-yassir.github.io/ePortfolio/

A single-page website built from the Canva ePortfolio. Scroll through it, or use the slim sidebar on the left:
hovering it slides it out with the section names, and clicking an icon jumps to that section.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All the content |
| `assets/css/style.css` | Styles (desktop layout from 1100px wide; phones and tablets get a stacked layout) |
| `assets/js/main.js` | Tabs, smooth scrolling, sticky header, mobile menu, video button |
| `assets/img/`, `assets/svg/` | Photos, logos and icons taken from the design |
| `assets/video/` | The "A little more about me" video |
| `assets/fonts/` | Free web fonts standing in for Aptos (Hanken Grotesk), The Seasons (Newsreader) and Times New Roman MT Pro (Tinos) |

## The video (section "A little more about me")

The video is `assets/video/eportfolio.mp4` and its cover image is `assets/img/video-poster.webp`.
Visitors start it with the triangle in the middle of the frame; the usual player controls appear once it plays.

To swap in a new video, replace those two files with new ones under the same names (keep the video well under
GitHub's 100 MB file limit).

## CV and Resume buttons

The "CV (Français)" and "Resume (English)" buttons on the welcome screen are greyed out until the files exist.
To switch one on, add the PDF to `assets/docs/` and, in `index.html`, replace its `<button class="btn" type="button" disabled>`
… `</button>` with `<a class="btn" href="assets/docs/YOUR-FILE.pdf" target="_blank" rel="noopener">` … `</a>`
(keep the icon and label inside).

Pushing to the `main` branch republishes the site within a minute or two.
