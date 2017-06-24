import { Router } from 'express'
import fs from 'fs'
import { extname } from 'path'
import touch from 'touch'
import axios from 'axios'
import jimp from 'jimp'
import qs from 'qs'
import NodeCache from 'node-cache'
import { devPresent, devLog, streamToBuffer } from '~/utils'

const gm = require('gm').subClass({imageMagick: true})

var router = Router()
const BASE_URL = '/image/'

// Настройки времени кэширования, в секундах
const CACHE_TTL = global.env.IMG_CACHE_TTL, CACHE_PERIOD = global.env.IMG_CACHE_PERIOD
const imageCache = new NodeCache( { stdTTL: CACHE_TTL, checkperiod: CACHE_PERIOD, useClones: false } );

function getParam (param, type) {
  if (typeof param === 'array') return param[0]
  else if (typeof param === 'object') return param[Object.keys(param)[0]]
  else return param
}

const DEF_WIDTH = 300
router.get(BASE_URL + 'jimp', async function (req, res, next) {
  // Функция для установки типа
  const setType = (lRes, lExt) => {
    return lRes.type('image/' + lExt)
  }
  let t1 = devPresent()
  if (!req.query.url) {
    res.end()
    return
  }
  // else
  const imagePath = global.conf.staticPath + '/data/sharp'
  // let fileName = req.query.url.replace(/(http|https|ftp)?\:\/\//g, '')
  //   .replace(/(\/[/]?|\?|\:|\*|\\|\<|\>|\|\'|\")/g, '__')
  // devLog(JSON.stringify(qs.stringify(req.query)).slice(0, 186))
  // devLog(JSON.stringify(req.query).slice(0, 186))
  const queryString = qs.stringify(req.query).slice(0, 186);
  const url = getParam(req.query.url)
  let ext = extname(url).slice(1)
  // Убираем query из расширения, если он там есть
  ext = ext.replace(/\?.*$/, '')
  const resp = imageCache.get(queryString)
  if (resp) {
    devLog('getting from memory')
    setType(res, ext).send(resp)
    imageCache.ttl(queryString, CACHE_TTL, () => { 
      true
    })
    return
  }
  // Если расширение слишком длинное (т.е. вероятнее всего неправильное),
  // то принудительно применяем jpg
  if (ext.length > 6) req.query.j = true
  // devLog(fileName, ext)
  let fileName = Buffer.from(queryString)
    .toString('base64').replace(/\//g, '_')
  const filePath = imagePath + '/' + fileName
  if (fs.existsSync(filePath)) {
    touch(filePath)
    let fstream = fs.createReadStream(filePath)
    fstream.pipe(res)
    streamToBuffer(fstream).then((buff) => {
      imageCache.set(queryString, buff)
    })
    return
  }
  const width = parseInt(getParam(req.query.w)) || DEF_WIDTH
  let origImgRes
  try {
    origImgRes = await axios.get(url, {
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
  let img = await jimp.read(origImgBuffer)
  img.resize(width, jimp.AUTO)
  // else if (ext === 'png') sharper = sharper.png({
  //   compressionLevel: 7
  // })
  // if (ext === 'jpg' || ext === 'jpeg' || getParam(req.query.j)) {
  //   img.jpeg({
  //     quality: parseInt(getParam(req.query.q)) || 80
  //   })
  //   ext = 'jpeg'
  // }
  img.getBuffer('image/png', (err, buff) => {
    origImgBuffer = undefined
    setType(res, ext).send(buff)
    fs.writeFile(filePath, buff)
    imageCache.set(queryString, buff, (err, scs) => {
      true
    })
    let t2 = devPresent() // DBG
    devLog("Writing to file took " + (t2 - t1) + " milliseconds.")
  })
  let t2 = devPresent() // DBG
  devLog("Image processing took " + (t2 - t1) + " milliseconds.")
})

router.get(BASE_URL + 'thumb', async function (req, res, next) {
  // Функция для установки типа
  const setType = (lRes, lExt) => {
    return lRes.type('image/' + lExt)
  }
  let t1 = devPresent()
  if (!req.query.url) {
    res.end()
    return
  }
  // else
  const imagePath = global.conf.staticPath + '/data/sharp'
  // let fileName = req.query.url.replace(/(http|https|ftp)?\:\/\//g, '')
  //   .replace(/(\/[/]?|\?|\:|\*|\\|\<|\>|\|\'|\")/g, '__')
  // devLog(JSON.stringify(qs.stringify(req.query)).slice(0, 186))
  // devLog(JSON.stringify(req.query).slice(0, 186))
  const queryString = qs.stringify(req.query).slice(0, 186);
  const url = getParam(req.query.url)
  let ext = extname(url).slice(1)
  // Убираем query из расширения, если он там есть
  ext = ext.replace(/\?.*$/, '')
  const resp = imageCache.get(queryString)
  if (resp) {
    devLog('getting from memory')
    setType(res, ext).send(resp)
    imageCache.ttl(queryString, CACHE_TTL, () => { 
      true
    })
    return
  }
  // Если расширение слишком длинное (т.е. вероятнее всего неправильное),
  // то принудительно применяем jpg
  if (ext.length > 6) req.query.j = true
  // devLog(fileName, ext)
  let fileName = Buffer.from(queryString)
    .toString('base64').replace(/\//g, '_')
  const filePath = imagePath + '/' + fileName
  if (fs.existsSync(filePath)) {
    touch(filePath)
    let fstream = fs.createReadStream(filePath)
    fstream.pipe(res)
    streamToBuffer(fstream).then((buff) => {
      imageCache.set(queryString, buff)
    })
    return
  }
  const width = parseInt(getParam(req.query.w)) || DEF_WIDTH
  let origImgRes
  try {
    origImgRes = await axios.get(url, {
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
  let img = gm(origImgBuffer).resize(width)
  // else if (ext === 'png') sharper = sharper.png({
  //   compressionLevel: 7
  // })
  // if (ext === 'jpg' || ext === 'jpeg' || getParam(req.query.j)) {
  //   sharper = sharper.jpeg({
  //     quality: parseInt(getParam(req.query.q)) || 80
  //   })
  //   ext = 'jpeg'
  // }
  img.stream().pipe(res)
  img.toBuffer('PNG', (err, buff) => {
    origImgBuffer = undefined
    fs.writeFile(filePath, buff)
    imageCache.set(queryString, buff, (err, scs) => {
      true
    })
    let t2 = devPresent() // DBG
    devLog("Writing to file took " + (t2 - t1) + " milliseconds.")
  })
  let t2 = devPresent() // DBG
  devLog("Image processing took " + (t2 - t1) + " milliseconds.")
})

export default router
