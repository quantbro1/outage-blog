# Outage Blog
A free website that scrapes X for outage reports, generates blog posts, and uses Google AdSense.

## Setup
1. **Clone this repo**: `git clone <repo-url>`
2. **Install dependencies**: `npm install`
3. **Test locally**: `npm run serve`
4. **Push to GitHub**: GitHub Actions will run `scrape.js` every 6 hours.
5. **Deploy on Netlify**:
   - Connect your GitHub repo in Netlify.
   - Set build command: `npm run build`
   - Set publish directory: `_site`
6. **Add AdSense**: Replace `ca-pub-XXXX` and `data-ad-slot="YYYY"` in `_includes/layout.njk` with your AdSense details.

## Notes
- Uses Nitter (nitter.net) to scrape X without login (public data only).
- Check X's ToS to ensure compliance.
- AdSense approval requires sufficient content—add manual posts initially.
