const fs = require('fs');

module.exports = async function (name, buffer) {
    await fs.writeFileSync(`${name}.png`, buffer.replace(/^data:image\/png;base64,/, ''), 'base64');
    console.log(`${name}.png saved`)
};
