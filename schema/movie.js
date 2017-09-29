var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
  poster: String,
  imgsrc: String,
  title: String,
  author: String,
  total: String, 
  score: String,
  country: String,
  summary: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 添加方法
// pre save每次存储数据时调用这个方法
MovieSchema.pre('save', function(next){
  if (this.isNew) {
    // 如果是新增加的数据，更新时间
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.createAt = Date.now()
  }

  next()
})

// 静态方法
// 通过model编译后才会调用该方法
MovieSchema.statics = {
  fetch: function(cb){
    return this.find({}).sort('meta.updateAt').exec(cb)
  },
  findById: function(id, cb){
    return this.findOne({_id: id}).exec(cb)
  }
}

// 导出方法
module.exports = MovieSchema
