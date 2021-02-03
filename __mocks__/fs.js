const _fs =jest.requireActual('fs')
const fs = jest.createMockFromModule('fs');
Object.assign(fs, _fs);
let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}

fs.readFile = (path, options, callback) => {
  if (callback === undefined) {callback = options}
  if (path in readMocks) {
    callback(...readMocks[path])
  } else {
    _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}

fs.writeFile = (path, data, options, callback) => {
  if (path in writeMocks) {
    writeMocks[path](path, data, options, callback)
  } else {
    _fs.writeFile(path, data, options, callback)
  }
}

fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}


module.exports = fs
// const mock = {}
// fs.setMock = (path, error, data) => {
//   mock[path] = [error, data]
// }
// fs.readFile = (path, options, callback) => {
//   callback = callback || options
//   if (mock[path]) {
//     callback(...mock[path])
//   } else {
//     _fs.readFile(path, options, callback)
//   }
// }
// module.exports = fs;