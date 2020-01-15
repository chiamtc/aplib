//learnt fromt https://itnext.io/automated-ui-testing-with-selenium-and-javascript-90bbe7ca13a3

//TODO: coverage https://medium.com/@the1mills/front-end-javascript-test-coverage-with-istanbul-selenium-4b2be44e3e98
/*
~~steps maybe for CI machine~~
1. download geckodriver from https://selenium.dev/selenium/docs/api/javascript/index.html
2. place the executable files in /usr/local/bin
3. node sl.js

just install via npm and require it in the test
 */

require('geckodriver');
const webdriver = require('selenium-webdriver');
const fs = require('fs');
const {assert} = require('chai');
const saveScreenshot = require('./utils');

const path = require('path')
const testFileName = path.basename(__filename).split('.')[0].toUpperCase();

describe(`${testFileName} test suite`, () => {
    let driver;
    let output = 'src/app/test/e2e/firefox-test-results';
    beforeAll(async () => {
        if (!fs.existsSync(output)) await fs.mkdirSync(output);
        driver = await new webdriver.Builder().forBrowser('firefox').build();
    });

    beforeEach(async () => await driver.get('http://localhost:9000'))

    afterAll(() => driver && driver.quit());

    //have to do it this way to get spectrogram displayed and takescreenshot.
    it(`[${testFileName}-001] Load audio based on given url`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        assert.equal(await playBtn.getText(), 'play');
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await saveScreenshot(`${output}/${testFileName}-001`, ssBuffer)
            done();
        }, 3000);
    });

    it.only(`[${testFileName}-002] Plays decoded and filtered audio using default filter from firebase`, async () => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn)).click();

        const txtTime = await driver.findElement(webdriver.By.id('txt-time'));

        await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
        const ssBuffer = await driver.takeScreenshot();
        await saveScreenshot(`${output}/${testFileName}-002-001`, ssBuffer);

        await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
        const ssBuffer2 = await driver.takeScreenshot();
        await saveScreenshot(`${output}/${testFileName}-002-002`, ssBuffer2);

        assert.equal(await playBtn.getText(), 'pause');
    });

    it(`[${testFileName}-003] changes filter from Extended -> Diaphragm -> Midrange -> Bell -> Heart filters `, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        const ready = await driver.wait(webdriver.until.elementIsEnabled(playBtn));

        //fucking kill me with this settimeout hell
        setTimeout(async () => {
            if (ready) {
                const ssBuffer = await driver.takeScreenshot();
                await saveScreenshot(`${output}/${testFileName}-003-001`, ssBuffer);

                const select = await driver.findElement(webdriver.By.id('filter-select'))
                await select.click();
                //before
                assert.equal(await select.getAttribute('value'), 'F0');
                const options = await driver.findElements(webdriver.By.tagName('option'));
                //changing to diaphragm filter
                await options[1].click();
                assert.equal(await select.getAttribute('value'), 'F5');

                setTimeout(async () => {
                    const ssBuffer2 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-003-002`, ssBuffer2);

                    setTimeout(async () => {
                        //changing to midrange filter
                        await select.click();
                        await options[2].click();
                        assert.equal(await select.getAttribute('value'), 'F6');

                        setTimeout(async () => {
                            const ssBuffer3 = await driver.takeScreenshot();
                            await saveScreenshot(`${output}/${testFileName}-003-003`, ssBuffer3);

                            setTimeout(async () => {
                                //changing to bell filter
                                await select.click();
                                await options[3].click();
                                assert.equal(await select.getAttribute('value'), 'F7');

                                setTimeout(async () => {
                                    const ssBuffer4 = await driver.takeScreenshot();
                                    await saveScreenshot(`${output}/${testFileName}-003-004`, ssBuffer4);

                                    setTimeout(async () => {
                                        //changing to bell filter
                                        await select.click();
                                        await options[4].click();
                                        assert.equal(await select.getAttribute('value'), 'F8');

                                        setTimeout(async () => {
                                            const ssBuffer5 = await driver.takeScreenshot();
                                            await saveScreenshot(`${output}/${testFileName}-003-005`, ssBuffer5);
                                            done();
                                        }, 3000)
                                    }, 3000);
                                }, 3000)
                            }, 3000);
                        }, 3000);
                    }, 3000);
                }, 3000);
            }
        }, 3000);
    });

    it(`[${testFileName}-004] Change to [Diaphragm Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await saveScreenshot(`${output}/${testFileName}-004-001`, ssBuffer);

            setTimeout(async () => {

                const select = await driver.findElement(webdriver.By.id('filter-select'))
                await select.click();
                //before
                assert.equal(await select.getAttribute('value'), 'F0');
                const options = await driver.findElements(webdriver.By.tagName('option'));
                //changing to diaphragm filter
                await options[1].click();
                assert.equal(await select.getAttribute('value'), 'F5');

                setTimeout(async () => {
                    await playBtn.click();
                    assert.equal(await playBtn.getText(), 'pause');
                    const txtTime = await driver.findElement(webdriver.By.id('txt-time'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-004-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-004-003`, ssBuffer3);
                    done();
                }, 3000)
            }, 3000)
        }, 3000)
    });

    it(`[${testFileName}-005] Change to [Midrange Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await saveScreenshot(`${output}/${testFileName}-005-001`, ssBuffer);

            setTimeout(async () => {

                const select = await driver.findElement(webdriver.By.id('filter-select'))
                await select.click();
                //before
                assert.equal(await select.getAttribute('value'), 'F0');
                const options = await driver.findElements(webdriver.By.tagName('option'));
                //changing to midrange filter
                await options[2].click();
                assert.equal(await select.getAttribute('value'), 'F6');

                setTimeout(async () => {
                    await playBtn.click();
                    assert.equal(await playBtn.getText(), 'pause');
                    const txtTime = await driver.findElement(webdriver.By.id('txt-time'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-005-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-005-003`, ssBuffer3);
                    done();
                }, 3000)
            }, 3000)
        }, 3000)
    });

    it(`[${testFileName}-006] Change to [Bell Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await saveScreenshot(`${output}/${testFileName}-006-001`, ssBuffer);

            setTimeout(async () => {

                const select = await driver.findElement(webdriver.By.id('filter-select'))
                await select.click();
                //before
                assert.equal(await select.getAttribute('value'), 'F0');
                const options = await driver.findElements(webdriver.By.tagName('option'));
                //changing to bell filter
                await options[3].click();
                assert.equal(await select.getAttribute('value'), 'F7');

                setTimeout(async () => {
                    await playBtn.click();
                    assert.equal(await playBtn.getText(), 'pause');
                    const txtTime = await driver.findElement(webdriver.By.id('txt-time'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-006-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-006-003`, ssBuffer3);
                    done();
                }, 3000)
            }, 3000)
        }, 3000)
    });

    it(`[${testFileName}-007] Change to [Heart Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await saveScreenshot(`${output}/${testFileName}-007-001`, ssBuffer);

            setTimeout(async () => {

                const select = await driver.findElement(webdriver.By.id('filter-select'))
                await select.click();
                //before
                assert.equal(await select.getAttribute('value'), 'F0');
                const options = await driver.findElements(webdriver.By.tagName('option'));
                //changing to heart filter
                await options[4].click();
                assert.equal(await select.getAttribute('value'), 'F8');

                setTimeout(async () => {
                    await playBtn.click();
                    assert.equal(await playBtn.getText(), 'pause');
                    const txtTime = await driver.findElement(webdriver.By.id('txt-time'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-007-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await saveScreenshot(`${output}/${testFileName}-007-003`, ssBuffer3);
                    done();
                }, 3000)
            }, 3000)
        }, 3000)
    });

});
