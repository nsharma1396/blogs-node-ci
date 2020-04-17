const puppeteer = require("puppeteer");

/**
 * @type {import ("puppeteer").Browser}
 */
let browser;
/**
 * @type {import ("puppeteer").Page}
 */
let page;

beforeEach(async () => {
  browser = await puppeteer
    .launch
    //   {
    //   headless: false,
    // }
    ();
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  console.log(text);

  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = page.url();
  console.log(url);
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  const id = "5e9620dac0f3443e2817636b"; // taken from db

  const Buffer = require("safe-buffer").Buffer;
  require("dotenv").config();
  const sessionObject = {
    passport: {
      user: id,
    },
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );

  const Keygrip = require("keygrip");
  const keygrip = new Keygrip([process.env.COOKIE_KEY]);
  const sig = keygrip.sign("session=" + sessionString);

  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("http://localhost:3000");
  console.log(sessionString, sig);
});

afterEach(async () => {
  await browser.close();
});
