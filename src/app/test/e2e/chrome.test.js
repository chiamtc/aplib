require('chromedriver');
const webdriver = require('selenium-webdriver');
const fs = require('fs');
const {assert} = require('chai');
const utils = require('./utils');

const path = require('path');
const testFileName = path.basename(__filename).split('.')[0].toUpperCase();
const timeout = 3000;
describe(`${testFileName} test suite`, () => {
    let driver;
    let output = 'src/app/test/e2e/chrome-test-results';
    beforeAll(async () => {
        if (!fs.existsSync(output)) await fs.mkdirSync(output);
        driver = await new webdriver.Builder().forBrowser('chrome').build();
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
            await utils.saveScreenshot(`${output}/${testFileName}-001`, ssBuffer)
            done();
        }, timeout);
    });

    it(`[${testFileName}-002] Plays decoded and filtered audio using default filter from firebase`, async () => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn)).click();

        const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

        await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
        const ssBuffer = await driver.takeScreenshot();
        await utils.saveScreenshot(`${output}/${testFileName}-002-001`, ssBuffer);

        await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
        const ssBuffer2 = await driver.takeScreenshot();
        await utils.saveScreenshot(`${output}/${testFileName}-002-002`, ssBuffer2);

        assert.equal(await playBtn.getText(), 'pause');
    });

    it(`[${testFileName}-003] changes filter from Extended -> Diaphragm -> Midrange -> Bell -> Heart filters `, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        const ready = await driver.wait(webdriver.until.elementIsEnabled(playBtn));

        //fucking kill me with this settimeout hell
        setTimeout(async () => {
            if (ready) {
                const ssBuffer = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-003-001`, ssBuffer);

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
                    await utils.saveScreenshot(`${output}/${testFileName}-003-002`, ssBuffer2);

                    setTimeout(async () => {
                        //changing to midrange filter
                        await select.click();
                        await options[2].click();
                        assert.equal(await select.getAttribute('value'), 'F6');

                        setTimeout(async () => {
                            const ssBuffer3 = await driver.takeScreenshot();
                            await utils.saveScreenshot(`${output}/${testFileName}-003-003`, ssBuffer3);

                            setTimeout(async () => {
                                //changing to bell filter
                                await select.click();
                                await options[3].click();
                                assert.equal(await select.getAttribute('value'), 'F7');

                                setTimeout(async () => {
                                    const ssBuffer4 = await driver.takeScreenshot();
                                    await utils.saveScreenshot(`${output}/${testFileName}-003-004`, ssBuffer4);

                                    setTimeout(async () => {
                                        //changing to bell filter
                                        await select.click();
                                        await options[4].click();
                                        assert.equal(await select.getAttribute('value'), 'F8');

                                        setTimeout(async () => {
                                            const ssBuffer5 = await driver.takeScreenshot();
                                            await utils.saveScreenshot(`${output}/${testFileName}-003-005`, ssBuffer5);
                                            done();
                                        }, timeout)
                                    }, timeout);
                                }, timeout)
                            }, timeout);
                        }, timeout);
                    }, timeout);
                }, timeout);
            }
        }, timeout);
    });

    it(`[${testFileName}-004] Change to [Diaphragm Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-004-001`, ssBuffer);

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
                    const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-004-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-004-003`, ssBuffer3);
                    done();
                }, timeout)
            }, timeout)
        }, timeout)
    });

    it(`[${testFileName}-005] Change to [Midrange Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-005-001`, ssBuffer);

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
                    const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-005-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-005-003`, ssBuffer3);
                    done();
                }, timeout)
            }, timeout)
        }, timeout)
    });

    it(`[${testFileName}-006] Change to [Bell Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-006-001`, ssBuffer);

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
                    const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-006-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-006-003`, ssBuffer3);
                    done();
                }, timeout)
            }, timeout)
        }, timeout)
    });

    it(`[${testFileName}-007] Change to [Heart Filter] and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-007-001`, ssBuffer);

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
                    const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-007-002`, ssBuffer2);

                    await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));
                    const ssBuffer3 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-007-003`, ssBuffer3);
                    done();
                }, timeout)
            }, timeout)
        }, timeout)
    });


    it(`[${testFileName}-008] adjusts gain from 1 to 3 with step of 0.5 and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        const btnenabled = await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        if (btnenabled) {
            setTimeout(async () => {
                const gainInput = await driver.findElement(webdriver.By.id('gain-input'));
                const ssBuffer = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-008-001`, ssBuffer);
                for (let i = 0; i < 4; i++) {
                    gainInput.sendKeys(webdriver.Key.ARROW_RIGHT);
                }
                await playBtn.click();
                setTimeout(async () => {
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-008-002`, ssBuffer2);
                    done();
                }, timeout)
            }, timeout)
        }
    });

    it(`[${testFileName}-009] Plays, pauses and resumes decoded and filtered audio using default filter from firebase`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));

        setTimeout(async () => {
            //play
            await driver.wait(webdriver.until.elementIsEnabled(playBtn)).click();

            assert.equal(await playBtn.getText(), 'pause');

            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-009-001`, ssBuffer);


            const txtTime = await driver.findElement(webdriver.By.id('time-txt'));

            //pause
            await driver.wait(webdriver.until.elementTextContains(txtTime, '5.'));
            await playBtn.click();

            assert.equal(await playBtn.getText(), 'resume')

            const ssBuffer2 = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-009-002`, ssBuffer2);

            //resume
            await playBtn.click();
            assert.equal(await playBtn.getText(), 'pause')
            const ssBuffer3 = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-009-003`, ssBuffer3);
            done();
        }, timeout);
    });

    it(`[${testFileName}-010] zoom 50px`, async (done) => {
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-010-001`, ssBuffer);

            setTimeout(async () => {
                const zoomBtn50 = await driver.findElement(webdriver.By.id('zoom-btn-50')).click();
                const zoomTxt = await driver.findElement(webdriver.By.id('zoom-txt'));
                assert.equal(await zoomTxt.getText(), '50');

                setTimeout(async () => {
                    const ssBuffer = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-010-002`, ssBuffer);
                    done();
                }, timeout)
            }, timeout);
        }, timeout);
    });

    it(`[${testFileName}-011] zoom 80px`, async (done) => {
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-011-001`, ssBuffer);

            setTimeout(async () => {
                const zoomBtn50 = await driver.findElement(webdriver.By.id('zoom-btn-80')).click();
                const zoomTxt = await driver.findElement(webdriver.By.id('zoom-txt'));
                assert.equal(await zoomTxt.getText(), '80');

                setTimeout(async () => {
                    const ssBuffer = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-011-002`, ssBuffer);
                    done();
                }, 4000)
            }, timeout);
        }, timeout);
    });

    it(`[${testFileName}-011] zoom 80px and plays`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));

        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-011-001`, ssBuffer);

            setTimeout(async () => {
                await driver.findElement(webdriver.By.id('zoom-btn-80')).click();
                const zoomTxt = await driver.findElement(webdriver.By.id('zoom-txt'));
                assert.equal(await zoomTxt.getText(), '80');

                await playBtn.click();
                const txtTime = await driver.findElement(webdriver.By.id('time-txt'));
                await driver.wait(webdriver.until.elementTextContains(txtTime, '19.'));

                const ssBuffer = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-011-002`, ssBuffer);
                done();
            }, timeout);
        }, timeout);
    });

    it(`[${testFileName}-012] clicks on canvas to test fast forward to 10th seconds and plays`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-012-001`, ssBuffer);
            setTimeout(async () => {
                const actions = driver.actions({bridge: true});
                await actions.move({x: 340, y: 500, origin: webdriver.Origin.POINTER}).press().release(); //10th seconds
                await actions.perform();
                const ssBuffer2 = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-012-002`, ssBuffer2);

                const txtTime = await driver.findElement(webdriver.By.id('time-txt'));
                await playBtn.click();

                await driver.wait(webdriver.until.elementTextContains(txtTime, '15.'));
                assert.isAtLeast(parseFloat(await txtTime.getText()), 10.0);

                const ssBuffer3 = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-012-003`, ssBuffer3);
                done();
            }, timeout);
        }, timeout);
    });

    it(`[${testFileName}-013] Change to [Heart Filter], fast forward 10th seconds and play`, async (done) => {
        const playBtn = await driver.findElement(webdriver.By.id('play-btn'));
        await driver.wait(webdriver.until.elementIsEnabled(playBtn));
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-013-001`, ssBuffer);

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
                    const actions = driver.actions({bridge: true});
                    await actions.move({x: 340, y: 500, origin: webdriver.Origin.POINTER}).press().release(); //10th seconds
                    await actions.perform();
                    const ssBuffer2 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-013-002`, ssBuffer2);

                    const txtTime = await driver.findElement(webdriver.By.id('time-txt'));
                    await playBtn.click();

                    assert.isAtLeast(parseFloat(await txtTime.getText()), 10.0);
                    await driver.wait(webdriver.until.elementTextContains(txtTime, '15.'));

                    const ssBuffer3 = await driver.takeScreenshot();
                    await utils.saveScreenshot(`${output}/${testFileName}-013-003`, ssBuffer3);
                    done();
                }, timeout)
            }, timeout)
        }, timeout)
    });

    it(`[${testFileName}-014] resize window to 500px and audioplayer re-renders waveform and plugins`, async (done) => {
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-014-001`, ssBuffer);
            await driver.manage().window().setRect({width: 500, height: 1000, x: 0, y: 0});
            setTimeout(async () => {
                const ssBuffer2 = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-014-002`, ssBuffer2);
                done();
            }, timeout);
        }, timeout);
    });

    it(`[${testFileName}-015] resize window to less than 300px and audioplayer will not re-renders waveform and plugins`, async (done) => {
        setTimeout(async () => {
            const ssBuffer = await driver.takeScreenshot();
            await utils.saveScreenshot(`${output}/${testFileName}-015-001`, ssBuffer);
            await driver.manage().window().setRect({width: 250, height: 1000, x: 0, y: 0});
            setTimeout(async () => {
                const ssBuffer2 = await driver.takeScreenshot();
                await utils.saveScreenshot(`${output}/${testFileName}-015-002`, ssBuffer2);
                done();
            }, timeout);
        }, timeout);
    });
});
