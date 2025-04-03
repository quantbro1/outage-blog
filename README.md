# Outage Blog

A simple blog that tracks power outages in the U.S. by scraping data from [PowerOutage.us](https://poweroutage.us). Built with Eleventy and deployed on Netlify.

## How It Works
- **Scraper**: `scrape.js` fetches outage data from PowerOutage.us and generates Markdown posts in the `posts/` directory.
- **Build**: Eleventy (`npm run build`) converts posts into a static site in `_site/`.
- **Deploy**: GitHub Actions pushes changes and deploys to Netlify when manually triggered.

## Running Manually

## Files
- `scrape.js`: Scrapes PowerOutage.us and generates posts.
- `_includes/layout.njk`: Site template with footer.
- `.github/workflows/scrape.yml`: Manual workflow configuration.

## License
MIT
