# Roberto Brunetti — academic website

A fast, hand-built static site (HTML + CSS + a little JS). No build step, no
framework. Hosted free on GitHub Pages.

## Structure

```
index.html            Home: bio, news, interests, links
research.html         Full publication list (rendered from data/publications.json)
teaching.html         Courses
data/publications.json   ← your publications live here
assets/css/style.css     Design (colours, layout, light/dark theme)
assets/js/main.js        Theme toggle + publication rendering
assets/img/profile.jpg   Your photo
CV/CV.pdf                Your CV (linked from the home page)
```

## Adding a publication

Edit `data/publications.json`. Add an object to `published`, `working`, or
`wip`. Example:

```json
{
  "year": 2027,
  "title": "My new paper",
  "authors": "R. Brunetti, A. Coauthor",
  "venue": "Journal of Public Economics",
  "status": "forthcoming",
  "abstract": "One paragraph describing the paper.",
  "links": [
    { "label": "PDF", "url": "https://..." },
    { "label": "DOI", "url": "https://doi.org/..." }
  ],
  "selected": true
}
```

- `selected: true` makes it appear in the "Selected publications" list on the
  home page (the 4 most recent selected entries are shown).
- `status`, `abstract`, and `links` are all optional — leave them `""` or `[]`.
- `wip` entries only need `title` and `authors`.

That's the whole workflow: edit the JSON, commit, push.

## Updating content

- **News** — edit the list in `index.html` under `<!-- ===== news ===== -->`.
- **Photo** — replace `assets/img/profile.jpg`.
- **CV** — replace `CV/CV.pdf`.

## Previewing locally

Because the publications load from a JSON file, open the site through a local
web server (not by double-clicking the file). From this folder:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploying to GitHub Pages

1. Create a repo named **`roberto-brunetti.github.io`** (use your exact GitHub
   username in place of `roberto-brunetti`).
2. Push this folder to it:

   ```bash
   git remote add origin https://github.com/<username>/roberto-brunetti.github.io.git
   git branch -M main
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → `main` / `(root)`**. Save.
4. After a minute the site is live at `https://<username>.github.io`.

Every later `git push` updates the live site automatically.
