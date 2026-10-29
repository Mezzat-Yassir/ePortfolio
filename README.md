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
| `assets/docs/` | The CV (French) and resume (English) PDFs opened by the buttons on the welcome screen |
| `assets/fonts/` | Free web fonts standing in for Aptos (Hanken Grotesk), The Seasons (Newsreader) and Times New Roman MT Pro (Tinos) |

## The video (section "A little more about me")

The video is `assets/video/eportfolio.mp4` and its cover image is `assets/img/video-poster.webp`.
Visitors start it with the triangle in the middle of the frame; the usual player controls appear once it plays.

To swap in a new video, replace those two files with new ones under the same names (keep the video well under
GitHub's 100 MB file limit).

## CV and Resume buttons

The "CV (Français)" and "Resume (English)" buttons on the welcome screen open the PDFs in `assets/docs/`
in a new tab:

- `assets/docs/CV_Mohamed_Yassir_Mezzat_FR.pdf` (French CV)
- `assets/docs/Resume_Mohamed_Yassir_Mezzat_EN.pdf` (English resume)

To update a resume, replace its PDF with a new one under the same file name. If the file name changes,
also change the matching `href` in `index.html`.

Pushing to the `main` branch republishes the site within a minute or two.
