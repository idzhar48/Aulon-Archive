# Aulon World Archive

Your existing Aulon archive, prepared for GitHub Pages. The original visual design and lore are preserved, including Legendary Techniques, Resonance Nullity, and Skau’Run.

The project generates 49 static pages: the dashboard, Sphere registry, 32 individual Sphere records, and 15 full lore articles. Search, category filters, the map interface and the timeline run in the browser. There are no packages to install, API keys to enter, or database accounts to create.

## Publish using the GitHub website

1. **Extract this ZIP on your computer.** Open the `Aulon-World-Archive-GitHub` folder. You will upload the contents of that folder, not the ZIP itself and not the enclosing folder.
2. **Create a GitHub repository named `aulon-world-archive`.** Initialize it with a README so the `main` branch exists. If you are using GitHub Free and want GitHub Pages, the repository must be public. Both the source and the lore in a public repository are visible to others.
3. **Enable Pages.** Open the repository’s **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**. Do not choose Jekyll or “Deploy from a branch” for this package.
4. **Upload this folder’s contents.** In the repository, choose **Add file → Upload files**, drag in all the extracted project files and folders, and commit the upload to `main`. Allow the supplied README to replace the initial README. At the repository’s top level you should see `package.json`, `source`, `scripts`, and `.github`, alongside the documentation.
5. **Check the workflow file.** Open `.github/workflows/deploy.yml` in your repository. It must exist at exactly that path. Some file pickers hide folders whose names start with a dot. Enable hidden files when selecting the upload. If that folder was skipped, use **Add file → Create new file**, name it `.github/workflows/deploy.yml`, and paste the contents of the identically named file from the extracted ZIP.
6. **Wait for the build.** Open the **Actions** tab and select **Publish Aulon World Archive**. After the build and deployment are green, return to **Settings → Pages → Visit site**. GitHub says publishing can take up to 10 minutes.

Your usual address will be `https://YOUR-USERNAME.github.io/aulon-world-archive/`. The workflow reads the repository’s Pages settings automatically; you do not need to replace a username anywhere in the code. It also supports a different repository name or a custom domain configured in Pages.

If the first workflow ran before Pages was enabled, enable it as described above, then go to **Actions → Publish Aulon World Archive → Run workflow**, select `main`, and run it again. If your branch has another name, change `branches: [main]` in the workflow to match.

The website has not been published by preparing this package. You choose when to upload and enable it. The old `chatgpt.site` address and its access settings are not transferred. A private repository on a supported paid plan does not by itself make an ordinary Pages website private. If you need invited-reader access, choose an authentication-capable host before publishing the lore.

## Use GitHub Desktop instead

GitHub Desktop is convenient for repeated edits and includes dot folders reliably:

1. Create a new local repository named `aulon-world-archive` in GitHub Desktop.
2. Copy all the contents of this extracted folder into that repository folder.
3. Review the changed files, enter a summary such as “Import Aulon World Archive”, and commit to `main`.
4. Click **Publish repository**. Select the visibility appropriate for your GitHub plan and your intended audience.
5. On GitHub, set **Settings → Pages → Source → GitHub Actions**. Run **Publish Aulon World Archive** from the Actions tab if the initial run occurred before Pages was configured.

For future changes, edit the local files, commit them in GitHub Desktop, and click **Push origin**. The workflow rebuilds and publishes the site.

## Which files should I edit?

| File or folder | Purpose |
| --- | --- |
| `source/articles/` | The 15 full lore articles, one HTML file per article |
| `source/records.js` | Library card titles, excerpts, categories, tags, and all Sphere records |
| `source/shell.html` | Dashboard, navigation, shared page structure, map and timeline containers |
| `source/styles.css` | Existing colours, typography, responsive layouts and visual styling |
| `source/app.js` | Navigation, searching, filtering, map interactions and timeline data |
| `source/routes.json` | Article paths, browser titles, view IDs and source filenames |
| `scripts/build.mjs` | Combines the source and generates the publishable `dist` folder |
| `scripts/check.mjs` | Checks generated pages, assets, article anchors and JavaScript syntax |
| `scripts/serve.mjs` | Optional local preview server |
| `.github/workflows/deploy.yml` | Builds, checks and publishes updates automatically |
| `CONTENT-INVENTORY.md` | List of preserved articles and page addresses |
| `MIGRATION-NOTES.md` | What changed during conversion and validation results |

For wording changes, edit the relevant file in `source/articles/`. These are HTML fragments: preserve their tags and IDs. To change an article’s library card excerpt or category, update its entry in `source/records.js` too. The workflow regenerates every affected page after you commit.

Adding a completely new article currently requires a source fragment, a shell placeholder, a route entry, a library card entry and its navigation handler. The existing site did not have a content management system; this package does not introduce one. You can ask a coding assistant to add those together while preserving existing articles.

## Optional preview on your computer

Install Node.js 22 or newer if you want a local preview. GitHub builds the site for you, so this installation is not required for the website-upload steps above.

Open a terminal in the extracted project folder and run:

```bash
npm run build
npm run check
npm run preview
```

Open `http://127.0.0.1:4173/` in your browser. Press Ctrl+C in the terminal to stop. Run the build again after editing source files, then refresh your browser.

To test the project URL shape before uploading:

```bash
npm run build -- --base-path /aulon-world-archive
npm run check
npm run preview
```

Open `http://127.0.0.1:4173/aulon-world-archive/`. The generated `dist` folder is intentionally ignored by Git: GitHub Actions creates it from source for every release. Do not upload `node_modules` or the original Sites restoration backup into this repository.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| No “Publish Aulon World Archive” workflow | Confirm `.github/workflows/deploy.yml` exists at the repository root. |
| “Get Pages site failed” or a Pages configuration error | Enable **Settings → Pages → GitHub Actions**, then run the workflow again. Check that your repository visibility is supported by your plan. |
| “package.json not found” | The project is nested one folder too deeply. Move this package’s contents to the repository root. |
| README appears instead of the website | Use **GitHub Actions** as the Pages source and wait for the supplied workflow to finish. |
| Styles or deep article links fail after changing the address | Rerun the workflow so it rebuilds with the current Pages base path. |
| Deployment is waiting for approval | Open the `github-pages` environment settings and review the deployment rules you or your organization configured. |
| Updated text is missing | Confirm the edit was committed to `main`, the latest workflow succeeded, and refresh the page. |

## Official references

- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Using custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Publishing an existing project with GitHub Desktop](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop)

This package does not add an open-source licence or change ownership of the supplied lore and design.
