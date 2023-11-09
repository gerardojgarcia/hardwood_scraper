const puppeteer = require('puppeteer');
const fs = require('fs');

async function searchLumberPrices(searchQuery, outputFile) {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    // Navigate to Google and search for the provided query
    await page.goto(`https://www.google.com/search?q=${searchQuery}`);

    // Wait for the search results to load
    await page.waitForSelector('.g');

    // Extract and store the search results
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

    // Create an array to store lumber price data
    const lumberPrices = [];

    // Iterate through the search results and visit each link
    for (const result of searchResults) {
      const link = result.link;
      if (link) {
        const lumberPage = await browser.newPage();
        await lumberPage.goto(link);

        // Perform scraping of lumber price information from the page
        const lumberPriceData = await lumberPage.evaluate(() => {
          // Modify this section to extract the lumber price data from the specific website
          // Example: const price = document.querySelector('.price-selector').textContent;
          // Replace the above line with the actual code to extract the price
          const price = 'Your code to extract the price';

          return { price };
        });

        lumberPrices.push({ link, lumberPriceData });

        // Close the lumber page
        await lumberPage.close();
      }
    }

    // Save the lumber price data to a JSON file
    fs.writeFileSync(outputFile, JSON.stringify(lumberPrices, null, 2));

    // Display a message indicating the data has been saved
    console.log(`Lumber price data saved to ${outputFile}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Usage: Call the function with the search query and output file name
const searchQuery = 'lumber prices';
const outputFile = 'lumber_prices.json';
searchLumberPrices(searchQuery, outputFile);
