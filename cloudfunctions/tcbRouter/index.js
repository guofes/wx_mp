// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter(event)
  app.use(async (ctx, next) => {
    ctx.data = {}
    ctx.data.openId = event.uerInfo.openId
    await next()
  })

  app.router('music', async (ctx, next) => {
    ctx.data.musicname = '数鸭子'
    await next()
  }, async (atx, next) => {
    ctx.data.musictype = '儿歌'
    ctx.data.body = {
      data: ctx.data
    }
  })
  return app.serve()
}

app.router('movie', async (ctx, next) => {
  ctx.data.moviename = '千与千寻'
  await next()
}, async (atx, next) => {
  ctx.data.movietype = '日本动画片'
  ctx.data.body = {
    data: ctx.data
  }
})
return app.serve()
}