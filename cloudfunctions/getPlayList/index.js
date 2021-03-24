// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const rp = require('request-promise')

// const URL = 'http://musicapi.xiecheng.live/personalized'
const URL = 'https://learn-cloud-music-api.vercel.app/personalized'
// https://vercel.com/guofes/learn-cloud-music-api
// https://neteasecloudmusicapi.vercel.app/#/?id=%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7%e6%ad%8c%e5%8d%95

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const playlistCollection = db.collection('playlist')
  const countResult = await playlistCollection.count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  const playlist = await rp(URL).then( res => {
    return JSON.parse(res).result
  })
  console.log(playlist.length, 'playlist')
  console.log(list.data.length, 'list')

  const newData = []
  playlist.map(item1 => {
    list.data.map(item2 => {
      if (item1.id !== item2.id) {
        newData.push(item1)
      }
    })
  })
  console.log(newData, 'newData')

  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(res => {
      console.log('插入失败')
    })
  }
  return newData.length
}