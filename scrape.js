const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Simple X scraping function with fallback
async function scrapeXForOutages() {
  try {
    // Use a reliable Nitter instance to scrape public X data
    const response = await axios.get('https://nitter.lacontrevoie.fr/search?q=%23outage', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
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
    // Return up to 5 outages, or fallback if none found
    return outages.length ? outages.slice(0, 5) : [
      { date: "2025-04-03", title: "Test Outage", content: "Fallback: No outages detected" }
    ];
  } catch (error) {
    console.error('Error scraping X:', error);
    return [
      { date: "2025-04-03", title: "Test Outage", content: "Scraping failed, using fallback data" }
    ];
  }
}

// Generate Markdown files and update data
async function generatePosts() {
  const outages = await scrapeXForOutages();
  if (!outages.length) {
    console.log('No outages to process');
    return;
  }

  // Update _data/outages.js for Eleventy
  const dataContent = `module.exports = ${JSON.stringify(outages, null, 2)};`;
  await fs.writeFile('_data/outages.js', dataContent);

  // Generate blog posts in posts directory
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
