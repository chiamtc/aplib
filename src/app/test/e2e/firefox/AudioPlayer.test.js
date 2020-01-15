
/*
~~steps maybe for CI machine~~
1. download geckodriver from https://selenium.dev/selenium/docs/api/javascript/index.html
2. place the executable files in /usr/local/bin
3. node sl.js

just install via npm and require it in the test
 */

require('geckodriver');
const {Builder, By, Key, until} = require('selenium-webdriver');


describe("AudioPlayer", () => {
    let driver;

    before(async () => driver = await new Builder().forBrowser('firefox').build());

    // after(() => driver && driver.quit());

    it('Load audio based on given url', async () => {
        await driver.get('http://localhost:9000');
        const playBtn = await driver.findElement(By.id('play-btn'));
        await driver.wait(until.elementIsEnabled(playBtn)).click();
    });
});
