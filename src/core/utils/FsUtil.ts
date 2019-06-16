import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)
const access = promisify(fs.access)

export class FsUtil {
  static async isPathExist (uri: string) {
    return new Promise(resolve => {
      fs.access(uri, fs.constants.F_OK, error => {
        resolve(!error)
      })
    })
  }

  static async createDirIfNotExists (uri: string) {
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

  static createDirs (dirs: string[]) {
    return Promise.all(dirs.map(dirUri => this.createDirIfNotExists(dirUri)))
  }

  static async removeOldFiles (dirPath: string, hours: number, toIgnoreGitFiles: boolean = true, extsToIgnore: string[] = []) {
    const files = await readdir(dirPath)

    const checkTime = Date.now()
    const hoursInMs = hours * 3600000
    const oldestTime = checkTime - hoursInMs

    if (toIgnoreGitFiles) {
      extsToIgnore = ['gitkeep', 'gitignore'].concat(extsToIgnore)
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
}

