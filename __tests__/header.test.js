const Page = require("./helpers/page");

/**
 * @type {Page & import ("puppeteer").Page}
 */
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

test("The header has the correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  await page.login();

  // const logoutAnchorText = await page.$eval(
  //   "a[href='/auth/logout']",
  //   (el) => el.innerHTML
  // );
  const logoutAnchorText = await page.getContentsOf("a[href='/auth/logout']");

  expect(logoutAnchorText).toEqual("Logout");
});

afterEach(async () => {
  await page.close();
});
