const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Simple X scraping function (no login, public data only)
async function scrapeXForOutages() {
  try {
    // Search X for outage-related posts (e.g., #outage)
    const response = await axios.get('https://nitter.net/search?q=%23outage', {
      headers: { 'User-Agent': 'Mozilla/5.0' } // Use Nitter as a proxy to avoid login
    });
    const $ = cheerio.load(response.data);
    
    const outages = [];
    $('.tweet-content').each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('down') || text.includes('outage')) {
        const date = new Date().toISOString().split('T')[0];
        const title = `Outage Reported: ${text.slice(0, 50)}...`;
        outages.push({ date, title, content: text });
      }
    });
    return outages.slice(0, 5); // Limit to 5 for simplicity
  } catch (error) {
    console.error('Error scraping X:', error);
    return [];
  }
}

// Generate Markdown files and update data
async function generatePosts() {
  const outages = await scrapeXForOutages();
  if (!outages.length) return;

  // Update _data/outages.js
  const dataContent = `module.exports = ${JSON.stringify(outages, null, 2)};`;
  await fs.writeFile('_data/outages.js', dataContent);

  // Generate blog posts
  const postsDir = path.join(__dirname, 'posts');
  await fs.mkdir(postsDir, { recursive: true });

  for (const outage of outages) {
    const fileName = `${outage.date}-outage.md`;
    const postContent = `---
layout: layout.njk
title: "${outage.title}"
date: ${outage.date}
---
${outage.content}
`;
    await fs.writeFile(path.join(postsDir, fileName), postContent);
  }
  console.log('Posts generated:', outages.length);
}

generatePosts();
