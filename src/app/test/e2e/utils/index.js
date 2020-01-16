const fs = require('fs');

exports.saveScreenshot = async function (name, buffer) {
    const executionTime = new Date().getTime()/1000;
    await fs.writeFileSync(`${name}_${executionTime}.png`, buffer.replace(/^data:image\/png;base64,/, ''), 'base64');
    console.log(`${name}_${executionTime}.png saved`)
};
