import { Router } from 'express'
import sharp from 'sharp'
import fs from 'fs'
import { extname } from 'path'
import touch from 'touch'
import axios from 'axios'
import jimp from 'jimp'
import qs from 'qs'
import NodeCache from 'node-cache'
// DBG
import present from 'present'

var router = Router()
const BASE_URL = '/image/'

// Настройки времени кэширования, в секундах
const CACHE_TTL = 500, CACHE_PERIOD = 60
const imageCache = new NodeCache( { stdTTL: CACHE_TTL, checkperiod: CACHE_PERIOD, useClones: false } );

/* GET user by ID. */
const DEF_WIDTH = 300
router.get(BASE_URL + 'sharp', async function (req, res, next) {
  // Функция для установки типа
  let setType = (lRes, lExt) => {
    return lRes.type('image/' + lExt)
  }
  let t1 = present()
  if (!req.query.url) {
    res.end()
    return
  }
  // else
  const imagePath = global.conf.staticPath + '/data/sharp'
  // let fileName = req.query.url.replace(/(http|https|ftp)?\:\/\//g, '')
  //   .replace(/(\/[/]?|\?|\:|\*|\\|\<|\>|\|\'|\")/g, '__')
  // console.log(JSON.stringify(qs.stringify(req.query)).slice(0, 186))
  // console.log(JSON.stringify(req.query).slice(0, 186))
  const queryString = qs.stringify(req.query).slice(0, 186);
  let ext = extname(req.query.url).slice(1)
  // Убираем query из расширения, если он там есть
  ext = ext.replace(/\?.*$/, '')
  const resp = imageCache.get(queryString)
  if (resp) {
    console.log('getting from memory')
    setType(res, ext).send(resp)
    imageCache.ttl(queryString, CACHE_TTL, () => { 
      true
    })
    return
  }
  // Если расширение слишком длинное (т.е. вероятнее всего неправильное),
  // то принудительно применяем jpg
  if (ext.length >  6) req.query.j = true
  // console.log(fileName, ext)
  let fileName = Buffer.from(queryString)
    .toString('base64').replace(/\//g, '_')
  const filePath = imagePath + '/' + fileName
  if (fs.existsSync(filePath)) {
    touch(filePath)
    setType(res, ext).sendFile(filePath)
    fs.readFile(filePath, (err, data) => {
      imageCache.set(queryString, data)
    })
    return
  }
  const width = parseInt(req.query.w) || DEF_WIDTH
  // fileName = `w${width}__${fileName}`
  // const origFilePath = imagePath + '/orig__' + fileName
  // touch.sync(origFilePath)
  let origImgRes
  try {
    origImgRes = await axios.get(req.query.url, {
      responseType: 'arraybuffer'
    })
  } catch (error) {
    res.send()
    return
  }
  // else
  // origImgRes.data.pipe(fs.createWriteStream(origFilePath));
  // sharp(origFilePath).toFile(filePath)
  let origImgBuffer = Buffer.from(origImgRes.data, 'binary')
  origImgRes = undefined
  let sharper = sharp(origImgBuffer).resize(width)
  // else if (ext === 'png') sharper = sharper.png({
  //   compressionLevel: 7
  // })
  if (ext === 'jpg' || ext === 'jpeg' || req.query.j) {
    sharper = sharper.jpeg({
      quality: req.query.q || 80
    })
    ext = 'jpeg'
  }
  const imgB = await sharper.toBuffer()
  origImgBuffer = undefined
  fs.writeFile(filePath, imgB)
  setType(res, ext).send(imgB)
  imageCache.set(queryString, imgB, (err, scs) => {
    true
  })
  let t2 = present()
  console.log("Call to doSomething took " + (t2 - t1) + " milliseconds.")
})

router.get(BASE_URL + 'jimp', async function (req, res, next) {
  let t1 = present()
  if (!req.query.url) {
    res.end()
    return
  }
  // else
  const imagePath = global.conf.staticPath + '/data/sharp'
  let fileName = req.query.url.replace(/(http|https|ftp)?\:\/\//g, '')
    .replace(/(\/[/]?|\?|\:|\*|\\|\<|\>|\|\'|\")/g, '__')
  const ext = extname(fileName).slice(1)
  const width = parseInt(req.query.w) || DEF_WIDTH
  fileName = `w${width}__${fileName}`
  const filePath = imagePath + '/' + fileName
  // const origFilePath = imagePath + '/orig__' + fileName
  // touch.sync(origFilePath)
  let origImgRes
  try {
    origImgRes = await axios.get(req.query.url, {
      responseType: 'arraybuffer'
    })
  } catch (error) {
    res.send()
    return
  }
  // else
  // origImgRes.data.pipe(fs.createWriteStream(origFilePath));
  // sharp(origFilePath).toFile(filePath)
  let origImgBuffer = Buffer.from(origImgRes.data, 'binary')
  origImgRes = undefined
  const img = await jimp.read(origImgBuffer)
  const imgB = img.quality(60).resize(width, -1).getBuffer('image/' + ext, (err, buff) => {
    fs.writeFile(filePath, buff)
    res.type('image/' + ext).send(buff)
    let t2 = present()
    console.log("Took " + (t2 - t1) + " milliseconds.")
  })
})

export default router
