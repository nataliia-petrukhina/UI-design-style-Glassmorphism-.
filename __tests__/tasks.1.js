const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Font Awesome', () => {
    it("Page should contain a Font Awesome CDN link", async () => {
        const head = await page.$eval('head', el => el.innerHTML);
        expect(head).toMatch(/font.*awesome/);
    });
});

describe('Font Awesome Icons', () => {
    it("Page should contain at least 2 font-awesome icons", async () => {
        const allClassesOnPage = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('*'), (element) => {
                return element.className;
            })
        })
        const fontAwesomeClass = /fa/g;
        expect(allClassesOnPage.filter(className => fontAwesomeClass.test(className)).length).toBeGreaterThanOrEqual(2)
    });
});

describe('Profile Image', () => {
    it("Page should contain a profile image", async () => {
        const imgTag = await page.$eval('img', (el) => el.src);
        expect(imgTag).toBeTruthy();
    });
});

describe('Font Family', () => {
    it("Page font-family should be 'Segoe UI'", async () => {
        const fontFamily = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-family')));
        expect(fontFamily.some(e => e.includes('Segoe UI'))).toBeTruthy();
    });
});

describe('Box-shadow', () => {
    it("`box-shadow` CSS property should be defined for the profile card", async () => {
        const boxShadow = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('box-shadow')));
        expect(boxShadow.filter(e => e !== 'none').length).toBeGreaterThan(0);
    });
});
describe('Backdrop-filter', () => {
    it("`backdrop-filter` css property should be used", async () => {
        const cardFilter = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('backdrop-filter')));
        expect(cardFilter.filter(e => e !== 'none').length).toBeGreaterThan(0);
    });
});
