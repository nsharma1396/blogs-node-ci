const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

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

test.only("When signed in, shows logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("http://localhost:3000");

  await page.waitFor('a[href="/auth/logout"]');

  const logoutAnchorText = await page.$eval(
    "a[href='/auth/logout']",
    (el) => el.innerHTML
  );

  expect(logoutAnchorText).toEqual("Logout");
});

afterEach(async () => {
  await browser.close();
});
