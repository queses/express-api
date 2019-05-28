const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

module.exports.isPathExist = async uri => {
  return new Promise((resolve, reject) => {
    fs.access(uri, fs.constants.F_OK, error => { resolve(!error) })
  })
}

module.exports.createDirIfNotExists = async uri => {
  let exists = true
  try {
    await access(uri, fs.constants.F_OK)
  } catch (e) {
    exists = false
  }

  if (!exists) {
    await mkdir(uri)
  }
}

module.exports.createDirs = dirs => Promise.all(dirs.map(dirUri => createDirIfNotExists(dirUri)))

module.exports.removeOldFiles = async (dirPath, hours, toIgnoreGitFiles = true, extsToIgnore = []) => {
  const files = await readdir(dirPath)

  const checkTime = Date.now()
  const hoursInMs = hours * 3600000
  const oldestTime = checkTime - hoursInMs

  if (toIgnoreGitFiles) {
    extsToIgnore = [ 'gitkeep', 'gitignore' ].concat(extsToIgnore)
  }

  await Promise.all(files.map(async (file) => {
    for (const ext of extsToIgnore) {
      if (file.endsWith('.' + ext)) {
        return
      }
    }

    const filePath = path.join(dirPath, file)
    const fileStat = await stat(filePath)

    if (fileStat.mtimeMs < oldestTime) {
      await unlink(filePath)
    }
  }))
}
