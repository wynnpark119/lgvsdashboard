const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://lgvs-dashboard.pages.dev';
const OUTPUT_DIR = path.join(__dirname, '../docs/images');

const PAGES = [
  { name: 'home', path: '/', title: 'Executive Overview' },
  { name: 'review-flow', path: '/review-flow', title: '기술별 관심 현황' },
  { name: 'tofu', path: '/review-flow/tofu', title: 'TOFU - 처음 접촉' },
  { name: 'mofu-bofu', path: '/review-flow/mofu-bofu', title: 'MOFU/BOFU - 깊은 관심' },
  { name: 'campaign-impact', path: '/campaign-impact', title: '캠페인 영향 분석' },
  { name: 'detail-technology', path: '/detail/technology', title: '기술별 상세' },
  { name: 'detail-channel', path: '/detail/channel', title: '채널별 상세' },
  { name: 'detail-inquiry', path: '/detail/inquiry', title: '문의 & 뉴스레터' },
  { name: 'detail-content', path: '/detail/content', title: '콘텐츠 상세' },
];

async function captureScreenshots() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const pageInfo of PAGES) {
    const url = `${BASE_URL}${pageInfo.path}`;
    console.log(`Capturing: ${pageInfo.title} (${url})`);

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1000)); // Wait for animations

      const outputPath = path.join(OUTPUT_DIR, `${pageInfo.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`  ✓ Saved: ${outputPath}`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to:', OUTPUT_DIR);
}

captureScreenshots();
