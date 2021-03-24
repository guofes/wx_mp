// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database().collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.skip(event.start).limit(event.count).orderBy('creatTime', 'desc').get().then((res) => {
      return res
  })
}