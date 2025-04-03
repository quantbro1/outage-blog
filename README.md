# Outage Blog

A simple blog tracking outages by scraping data from [Outage.Report](https://outage.report). Built with Eleventy and deployed on Netlify.

## How It Works
- **Scraper**: `scrape.js` fetches user-reported outage data from Outage.Report and generates Markdown posts in `posts/`.
- **Build**: Eleventy (`npm run build`) creates a static site in `_site/`.
- **Deploy**: GitHub Actions deploys to Netlify when manually triggered.

## Running Manually

## Files
- `scrape.js`: Scrapes Outage.Report for outage reports.
- `_includes/layout.njk`: Site template with footer crediting Outage.Report.
- `.github/workflows/scrape.yml`: Manual workflow configuration.

## License
MIT
