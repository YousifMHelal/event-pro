import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

// Login
await page.goto("http://localhost:3000/ar/login", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/01-login.png" });

const emailInput = page.locator('input[type="email"], input[name="email"]').first();
const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
await emailInput.fill("sara.alqahtani@eventpro.sa");
await passwordInput.fill("Passw0rd!");
await page.locator('button[type="submit"]').first().click();
await page.waitForLoadState("networkidle");
await page.screenshot({ path: "/tmp/02-after-login.png" });
console.log("URL after login:", page.url());

// Go to Arabic dashboard
await page.goto("http://localhost:3000/ar/dashboard", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/03-dashboard-ar.png", fullPage: true });
console.log("AR dashboard title:", await page.title());

// Go to English dashboard
await page.goto("http://localhost:3000/en/dashboard", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/04-dashboard-en.png", fullPage: true });
console.log("EN dashboard title:", await page.title());

await browser.close();
