const player = require('puppeteer')
const db = require('../utils/dbutils');

require('chai').should()

describe('oob', () => {
    let browser;
    let page;

    before(async () => {
        const conn = await db.getConnection(true, false)
        try {
            await db.exec(conn, "drop database elexisoobtest")
            await db.exec(conn, "drop user oobtester")
        } catch (prem) {
            console.log(prem)
        }

        browser = await player.launch({ headless: false, slowMo: 10, defaultViewport: { width: 1024, height: 800 } });
        page = await browser.newPage();
    })
    after(async () => {
        browser.close()
    })
    it("should initialize OOB Database", async () => {
        await page.goto("http://localhost:3000");
        (await page.title()).should.equal("Elexis Out-Of-The-Box")
        await page.click("#initdb")
        await page.$eval("#dbname", el => el.value = "elexisoobtest")
        await page.$eval("#dbuser", el => el.value = "oobtester")
        await page.click('button[type="submit"]');
        await page.waitForSelector("#place")
        await page.click('button[type="submit"]');
        await page.waitForSelector('button#tomain')
        await page.click('button[type="submit"]');
        await page.waitForSelector('a[href="/db/loaddata"]')
        // load demoDB
        await page.click('a[href="/db/loaddata"]')
        await page.click("#demodb")
        await page.click('button[type="submit"]')
        await page.waitForSelector('button#tomain');
        (await page.$eval("h1",h=>h.innerText)).should.equal("Erfolg")
        await page.click('button[type="submit"]');
        // main site
    }).timeout(20000)
})
