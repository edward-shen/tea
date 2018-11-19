function mock_readFileSync(path, encoding) {
  return `username = "fileuser"\npassword = "filepass"\n`;
}

function mock_existsSync(path) {
  return true;
}

function mock_writeFileSync(path) {

}

export default {
  existsSync: mock_existsSync,
  readFileSync: mock_readFileSync,
  writeFileSync: mock_writeFileSync
};
