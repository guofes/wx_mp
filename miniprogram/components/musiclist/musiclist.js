// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect (event) {
      console.log(event)
      const musicId = event.currentTarget.dataset.musicid
      const index = event.currentTarget.dataset.index
      this.setData({
        playingId: musicId
      })
      // target: 真正的事件源; currentTarget: 绑定事件的元素
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&index=${index}`,
      })
    }
  }
})
