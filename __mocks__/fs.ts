let mockFiles = {};

function __setMockFiles(files) {
  mockFiles = {};
  for (const path in files) {
    writeFileSync(path, files[path]);
  }
}

function existsSync(path): boolean {
  return mockFiles[path] !== undefined;
}

function readFileSync(path): string {
  return mockFiles[path];
}

function writeFileSync(path, content) {
  mockFiles[path] = content;
}

export {
  __setMockFiles,
  existsSync,
  readFileSync,
  writeFileSync
};
