const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true, // false,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    /**
     * @type {CustomPage & import ("puppeteer").Page}
     */
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    const cookies = [
      {
        // });
        // await this.page.setCookie({
        name: "express:sess.sig",
        // expires:
        //   new Date(Date.now() + 1 * 1000 * 60 * 60 * 24).getTime() / 1000, // Date.now() + 10 * 1000 * 24,
        // session: true,
        value: sig,
        // httpOnly: true,
        // domain: "localhost",
        // url: "http://localhost:3000",
      },
      {
        name: "express:sess",
        // expires:
        //   new Date(Date.now() + 1 * 1000 * 60 * 60 * 24).getTime() / 1000, // Date.now() + 10 * 1000 * 24,
        // session: true,
        value: session,
        // httpOnly: true,
        // domain: "localhost",
        // url: "http://localhost:3000",
      },
    ];

    await this.page.setCookie(...cookies);
    // await this.page.goto("http://localhost:3000");

    await this.page.goto("http://localhost:3000/blogs");

    console.log(await this.page.cookies());

    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
