import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            resolve(true);
          } else {
            setTimeout(check, 500);
          }
        })
        .on('error', () => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timeout waiting for server at ${url}`));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

async function runBenchmark() {
  console.log('Starting production server on port', PORT, '...');
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  try {
    await waitForServer(BASE_URL);
    console.log('Server is online at', BASE_URL);

    const browser = await chromium.launch({ headless: true });

    const pagesToMeasure = [
      '/en',
      '/id',
      '/en/projects/scovis',
      '/en/about',
      '/en/credentials'
    ];

    const viewports = [
      { name: 'Desktop 1280x800', width: 1280, height: 800, isMobile: false },
      { name: 'Desktop 1536x864', width: 1536, height: 864, isMobile: false },
      { name: 'Mobile 390x844 (iPhone 14)', width: 390, height: 844, isMobile: true },
      { name: 'Mobile 430x932 (iPhone 15 Pro Max)', width: 430, height: 932, isMobile: true }
    ];

    const results = [];

    // 1. Core Matrix: Pages x Viewports under Normal Conditions
    console.log('\n--- 1. MEASURING CORE MATRIX (Normal Network & CPU) ---');
    for (const vp of viewports) {
      for (const route of pagesToMeasure) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          isMobile: vp.isMobile,
          hasTouch: vp.isMobile
        });
        const page = await context.newPage();

        // Collect network transfer data
        let totalBytesTransferred = 0;
        let requestCount = 0;
        page.on('response', async (res) => {
          try {
            const buffer = await res.body();
            totalBytesTransferred += buffer.length;
            requestCount++;
          } catch {
            // Ignored for redirected/empty
          }
        });

        // Inject Web Vitals observer before page loads
        await page.addInitScript(() => {
          window.__vitals = {
            cls: 0,
            lcp: 0,
            fcp: 0,
            ttfb: 0,
            longTasks: 0,
            totalLongTaskTime: 0
          };

          // CLS
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__vitals.cls += entry.value;
              }
            }
          }).observe({ type: 'layout-shift', buffered: true });

          // LCP
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              window.__vitals.lcp = lastEntry.startTime;
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Long Tasks
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              window.__vitals.longTasks++;
              window.__vitals.totalLongTaskTime += entry.duration;
            }
          }).observe({ type: 'longtask', buffered: true });
        });

        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
        // Allow brief stabilization for LCP and visualizer hydration
        await page.waitForTimeout(600);

        const vitals = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const fcpEntry = performance.getEntriesByType('paint').find((e) => e.name === 'first-contentful-paint');

          return {
            ttfb: nav ? nav.responseStart - nav.requestStart : 0,
            domInteractive: nav ? nav.domInteractive : 0,
            loadComplete: nav ? nav.loadEventEnd : 0,
            fcp: fcpEntry ? fcpEntry.startTime : 0,
            lcp: window.__vitals.lcp || (fcpEntry ? fcpEntry.startTime : 0),
            cls: window.__vitals.cls,
            longTasks: window.__vitals.longTasks,
            totalLongTaskTime: window.__vitals.totalLongTaskTime
          };
        });

        results.push({
          route,
          viewport: vp.name,
          network: 'Normal',
          cpu: '1x',
          ttfb: Math.round(vitals.ttfb),
          fcp: Math.round(vitals.fcp),
          lcp: Math.round(vitals.lcp),
          cls: parseFloat(vitals.cls.toFixed(4)),
          longTasks: vitals.longTasks,
          tbtMs: Math.round(vitals.totalLongTaskTime),
          requests: requestCount,
          transferredKB: (totalBytesTransferred / 1024).toFixed(1)
        });

        await context.close();
      }
    }

    console.table(results);

    // 2. Network & CPU Throttling Simulation on Canonical Mobile (iPhone 14: 390x844)
    console.log('\n--- 2. SIMULATING NETWORK & CPU THROTTLING ON MOBILE (390x844) ---');
    const throttledResults = [];
    const testCases = [
      { network: 'Fast 4G', rtt: 150, download: 1.6 * 1024 * 1024, upload: 750 * 1024, cpuThrottling: 1 },
      { network: 'Slow 4G', rtt: 300, download: 500 * 1024, upload: 500 * 1024, cpuThrottling: 1 },
      { network: 'Normal', rtt: 0, download: -1, upload: -1, cpuThrottling: 4 }, // 4x CPU throttle
      { network: 'Slow 4G + 4x CPU', rtt: 300, download: 500 * 1024, upload: 500 * 1024, cpuThrottling: 4 }
    ];

    for (const tc of testCases) {
      for (const route of ['/en', '/en/projects/scovis', '/en/about']) {
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          isMobile: true,
          hasTouch: true
        });
        const page = await context.newPage();
        const client = await context.newCDPSession(page);

        // Apply network conditions
        if (tc.rtt > 0) {
          await client.send('Network.emulateNetworkConditions', {
            offline: false,
            latency: tc.rtt,
            downloadThroughput: tc.download,
            uploadThroughput: tc.upload,
            connectionType: 'cellular4g'
          });
        }

        // Apply CPU throttling
        if (tc.cpuThrottling > 1) {
          await client.send('Emulation.setCPUThrottlingRate', {
            rate: tc.cpuThrottling
          });
        }

        await page.addInitScript(() => {
          window.__vitals = { cls: 0, lcp: 0, longTasks: 0, totalLongTaskTime: 0 };
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) window.__vitals.lcp = lastEntry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              window.__vitals.longTasks++;
              window.__vitals.totalLongTaskTime += entry.duration;
            }
          }).observe({ type: 'longtask', buffered: true });
        });

        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load', timeout: 45000 });
        await page.waitForTimeout(1000);

        const vitals = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const fcpEntry = performance.getEntriesByType('paint').find((e) => e.name === 'first-contentful-paint');
          return {
            ttfb: nav ? nav.responseStart - nav.requestStart : 0,
            fcp: fcpEntry ? fcpEntry.startTime : 0,
            lcp: window.__vitals.lcp || (fcpEntry ? fcpEntry.startTime : 0),
            cls: window.__vitals.cls,
            longTasks: window.__vitals.longTasks,
            tbtMs: window.__vitals.totalLongTaskTime
          };
        });

        throttledResults.push({
          route,
          condition: tc.network,
          cpu: `${tc.cpuThrottling}x`,
          ttfb: Math.round(vitals.ttfb),
          fcp: Math.round(vitals.fcp),
          lcp: Math.round(vitals.lcp),
          cls: parseFloat(vitals.cls.toFixed(4)),
          longTasks: vitals.longTasks,
          tbtMs: Math.round(vitals.tbtMs)
        });

        await context.close();
      }
    }

    console.table(throttledResults);

    // 3. Interactive Runtime FPS / Animation / Observers audit
    console.log('\n--- 3. RUNTIME INTERACTIVE FPS & ANIMATION AUDIT ---');
    const runtimePage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await runtimePage.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle' });

    // Scroll through the entire page and check for frame drops / jank
    const scrollMetrics = await runtimePage.evaluate(async () => {
      let frames = 0;
      let startTime = performance.now();
      let lastFrameTime = startTime;
      let slowFrames = 0;

      const countFrame = (now) => {
        frames++;
        const delta = now - lastFrameTime;
        if (delta > 33.3) slowFrames++; // Longer than 30fps budget
        lastFrameTime = now;
      };

      const scrollDown = () => {
        return new Promise((resolve) => {
          let scrollInterval = setInterval(() => {
            window.scrollBy(0, 100);
            requestAnimationFrame(countFrame);
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
              clearInterval(scrollInterval);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 16);
        });
      };

      await scrollDown();
      const duration = (performance.now() - startTime) / 1000;
      return {
        durationSec: duration.toFixed(2),
        totalFrames: frames,
        avgFps: Math.round(frames / duration),
        slowFrames
      };
    });

    console.log('Scroll Benchmark Result:', scrollMetrics);

    await browser.close();
  } finally {
    console.log('Stopping test server...');
    server.kill();
  }
}

runBenchmark().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
