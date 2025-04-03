const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

async function scrapeOutageReport() {
  try {
    console.log('Scraping Outage.Report...');
    const response = await axios.get('https://outage.report/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const outages = [];

    // Scrape recent reports (adjust selector based on site structure)
    $('div.report-item').each((i, el) => {
      const service = $(el).find('.service-name').text().trim();
      const time = $(el).find('.report-time').text().trim();
      const comment = $(el).find('.report-comment').text().trim();
      if (service && (comment.toLowerCase().includes('down') || comment.toLowerCase().includes('outage'))) {
        const date = new Date().toISOString().split('T')[0];
        const title = `Outage Reported: ${service}`;
        const content = `${service} reported down on ${time}. User comment: ${comment}`;
        outages.push({ date, title, content });
      }
    });

    console.log(`Found ${outages.length} outages from Outage.Report`);
    return outages.length ? outages.slice(0, 5) : [
      { date: "2025-04-03", title: "Fallback Outage", content: "No outages detected from Outage.Report" }
    ];
  } catch (error) {
    console.error('Error scraping Outage.Report:', error.message);
    return [
      { date: "2025-04-03", title: "Fallback Outage", content: "Scraping failed, using test post" }
    ];
  }
}

async function generatePosts() {
  const outages = await scrapeOutageReport();
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
