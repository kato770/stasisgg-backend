/* eslint-disable new-cap */
const shell = require('shelljs');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const zip = require('bestzip');

const moduleName = argv.moduleName;
console.log('moduleName', moduleName);
if (!moduleName) {
  shell.exit(1);
}

const modulePath = `node_modules/${moduleName}`;

try {
  fs.statSync(modulePath);
} catch {
  shell.exit(1);
}

const destDir = `layers/${moduleName}/nodejs/node_modules`;
shell.mkdir('-p', destDir);

shell.cd(`layers/${moduleName}/nodejs`);

shell.exec('yarn init -y');
shell.exec(`yarn add ${moduleName}`);

shell.cd(`../`);
zip({
  source: 'nodejs',
  destination: `${moduleName}.zip`
})
  .then(console.log(`${moduleName} was zipped!`))
  .catch(console.error);
