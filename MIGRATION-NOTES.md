# Migration notes

Prepared on 13 September 2026 from `Aulon-World-Archive-Unpublished-Backup.zip`.

## Content preservation

- All 15 article fragments match the original backup byte-for-byte, excluding a final added newline.
- The original stylesheet is preserved, excluding whitespace at the file boundaries.
- The original 23 library cards and 32 Sphere records are retained.
- The three previously unpublished articles are present in full.
- The dashboard, map interface, timeline, summary cards and existing responsive rules are retained.
- The backup contains a stylized map made by the existing website code. It does not contain a separate illustrated Aulon map image; this package does not substitute a different map.

The content is the recovered backup snapshot. No comparison with a newer live deployment was performed. No new lore or new canon claims were introduced.

## Hosting changes

The original Worker returned one HTML document. This package extracts that document into a shared shell, the original stylesheet, browser scripts and individual article fragments. A dependency-free Node.js build assembles it into static files that GitHub Pages can serve.

The build generates real `index.html` files for every known article and Sphere path. The browser router recognizes trailing slashes and explicit `index.html` addresses. It also strips the repository base path before selecting a view and adds that base path when navigating. This supports direct links, page refreshes, repository renames and custom-domain builds.

The modal close handler now explicitly selects its close button instead of relying on a global identifier that can collide with the browser’s built-in `window.close` function.

GitHub Actions obtains the current Pages base path, builds, checks and deploys the `dist` folder. The original Sites identity and deployment configuration are not part of this new GitHub project. Keep your original restoration ZIP separately if you want to restore the earlier Sites deployment.

## Validation performed

- Built all 49 page files for both a root address and a repository subpath.
- Checked every generated route, required asset, article section anchor and browser-script syntax.
- Exercised 441 router cases across root, project and renamed-repository base paths.
- Passed 294 direct-link HTTP checks across root and repository-subpath builds, including trailing-slash and explicit `index.html` variants.
- Confirmed stylesheet, script and configuration assets return successfully, and unknown paths return a 404 page with the correct home link.
- Parsed the GitHub Actions YAML and checked its build and deploy jobs.
- Compared every preserved article fragment and the stylesheet against the backup.

A graphical browser was not available in the preparation environment, and the browser download could not complete. Desktop/mobile visual rendering and complete browser interaction testing were therefore not performed. The original design and responsive stylesheet were retained. Before sharing your new address, check the home page, one article, Sphere navigation, search, map controls, the modal close button, and a narrow mobile viewport in your own browser.

The workflow has not yet been run on your GitHub account. Its first actual GitHub deployment will occur after you upload the project and enable Pages.
