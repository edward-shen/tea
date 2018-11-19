
function existsSync(path) {
  return true;
}

function readFileSync(path, encoding) {
  return `username = "fileuser"\npassword = "filepass"\n`;
}

function writeFileSync(path) {

}

export {
  existsSync,
  readFileSync,
  writeFileSync
};
