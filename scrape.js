const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

async function scrapePowerOutage() {
  try {
    console.log('Scraping PowerOutage.us...');
    const response = await axios.get('https://poweroutage.us/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const outages = [];

    // Target the main outage table (adjust based on inspection)
    $('table tr').each((i, el) => {
      if (i === 0) return; // Skip header row
      const state = $(el).find('td:nth-child(1)').text().trim();
      const customersOutRaw = $(el).find('td:nth-child(2)').text().trim();
      const customersOut = parseInt(customersOutRaw.replace(/,/g, '')) || 0;
      if (customersOut > 0) { // Only include states with outages
        const date = new Date().toISOString().split('T')[0];
        const title = `Power Outage in ${state}`;
        const content = `${customersOut} customers affected in ${state} as of ${date}. Source: PowerOutage.us`;
        outages.push({ date, title, content });
        console.log(`Outage detected: ${state}, ${customersOut} customers`);
      }
    });

    console.log(`Found ${outages.length} outages from PowerOutage.us`);
    return outages.length ? outages.slice(0, 5) : [
      { date: "2025-04-03", title: "Fallback Outage", content: "No outages detected from PowerOutage.us" }
    ];
  } catch (error) {
    console.error('Error scraping PowerOutage.us:', error.message);
    return [
      { date: "2025-04-03", title: "Fallback Outage", content: "Scraping failed, using test post" }
    ];
  }
}

async function generatePosts() {
  const outages = await scrapePowerOutage();
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
