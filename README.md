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
| `assets/video/` | The "A little more about me" video |
| `assets/fonts/` | Free web fonts standing in for Aptos (Hanken Grotesk), The Seasons (Newsreader) and Times New Roman MT Pro (Tinos) |

## The video (section "A little more about me")

The video is `assets/video/eportfolio.mp4` and its cover image is `assets/img/video-poster.webp`.
Visitors start it with the triangle in the middle of the frame; the usual player controls appear once it plays.

To swap in a new video, replace those two files with new ones under the same names (keep the video well under
GitHub's 100 MB file limit).

Pushing to the `main` branch republishes the site within a minute or two.
