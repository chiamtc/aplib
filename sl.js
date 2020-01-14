const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get('http://localhost:9000');
        // await driver.findElement(By.name('q'));
        // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
        /*setTimeout(async()=>{
            await driver.quit();
        },5000)*/
    }
})();
/*
steps maybe for CI machine
1. download geckodriver from https://selenium.dev/selenium/docs/api/javascript/index.html
2. place the executable files in /usr/local/bin
3. node sl.js
 */


