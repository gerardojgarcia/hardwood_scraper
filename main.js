const puppeteer = require('puppeteer');
const fs = require('fs')

async function searchHardwoodPrices() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to Google and search for hardwood prices
  const searchQuery = 'hardwood prices';
  await page.goto(`https://www.google.com/search?q=${searchQuery}`);

  // Wait for the search results to load
  await page.waitForSelector('.g');

  // Extract and display the search results
  const searchResults = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.g');
    elements.forEach(element => {
      const title = element.querySelector('h3')?.textContent;
      const link = element.querySelector('a')?.href;
      results.push({ title, link });
    });
    return results;
  });

  // Display the search results
  console.log('Search results for hardwood prices:');
  searchResults.forEach((result, index) => {
    console.log(`Result ${index + 1}:`);
    console.log(`Title: ${result.title}`);
    console.log(`Link: ${result.link}`);
    console.log('\n');
  });

  // Save the search results to a JSON file
   const outputFileName = 'hardwood_prices.json';
   fs.writeFileSync(outputFileName, JSON.stringify(searchResults, null, 2));

   // Display a message indicating the data has been saved
   console.log(`Search results saved to ${outputFileName}`);

  // Close the browser
  await browser.close();
}

searchHardwoodPrices();
