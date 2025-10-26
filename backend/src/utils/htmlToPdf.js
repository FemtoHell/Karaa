const puppeteer = require('puppeteer');

let browser = null;

const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }
  return browser;
};

const generatePdfFromHtml = async ({ html, css }) => {
  const browserInstance = await getBrowser();
  const page = await browserInstance.newPage();
  
  try {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
    
    await page.setContent(fullHtml, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });
    
    await page.evaluateHandle('document.fonts.ready');
    await page.waitForTimeout(500);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      preferCSSPageSize: false
    });
    
    await page.close();
    
    return pdf;
  } catch (error) {
    await page.close();
    throw error;
  }
};

process.on('exit', async () => {
  if (browser) {
    await browser.close();
  }
});

module.exports = { generatePdfFromHtml };
