const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Active Nitter instances from your table
const nitterInstances = [
  'https://xcancel.com',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://lightbrd.com',
  'https://nitter.space'
];

async function scrapeXForOutages() {
  for (const instance of nitterInstances) {
    try {
      console.log(`Trying Nitter instance: ${instance}`);
      const response = await axios.get(`${instance}/search?q=%23outage`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 5000
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
      console.log(`Found ${outages.length} outages from ${instance}`);
      return outages.length ? outages.slice(0, 5) : [];
    } catch (error) {
      console.error(`Error with ${instance}: ${error.message}`);
    }
  }
  console.log('All Nitter instances failed, using fallback');
  return [
    { date: "2025-04-03", title: "Fallback Outage", content: "No outages detected from X" }
  ];
}

async function generatePosts() {
  const outages = await scrapeXForOutages();
  if (!outages.length) {
    console.log('No outages to process');
    return;
  }

  const postsDir = path.join(__dirname, 'posts');
  await fs.rm(postsDir, { recursive: true, force: true });
  await fs.mkdir(postsDir, { recursive: true });

  const dataContent = `module.exports = ${JSON.stringify(outages, null, 2)};`;
  await fs.writeFile('_data/outages.js', dataContent);

  for (const outage of outages) {
    const fileName = `${outage.date}-outage-${Date.now()}.md`;
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
