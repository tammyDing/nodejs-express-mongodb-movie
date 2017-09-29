var express = require('express')
var router = express.Router()

var mongoose = require('mongoose')
var Movie = require('../models/movie')

var underscore = require('underscore')

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost/nodejs_6_movie', {useMongoClient: true})

/* GET home page. */
router.get('/', function(req, res, next) {
  Movie.fetch(function(err, movies){
    if (err) console.log(err)

    res.render('./pages/index', {
      title: 'Index 信息首页',
      movies: movies
    })
  })
})

/* Get detail page. */
router.get('/movie/:id', function(req, res, next){
  var id = req.params.id
  Movie.findById(id, function(err, movie){
    if (err) console.log(err)

    res.render('./pages/detail', {      
      title: 'Detail 信息详情 ',
      movie: movie
    })
  })
})

/* Get admin page. */
router.get('/admin/movie', function(req, res, next){
  res.render('./pages/admin', {
    title: 'Admin 信息录入',
    movie: {
      imgsrc:'',
      poster: '',
      title: '',
      author: '',
      total: '',
      score: '',
      country: '',
      summary: ''
    }
  })
})

/* admin update movie */
router.get('/admin/update/:id', function(req, res){
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie){
      console.log(movie)
      res.render('./pages/admin', {
        title: 'Admin 信息更新',
        movie: movie
      })
    })
  };
})

/* admin post movie */
router.post('/admin/movie/new', function(req, res){
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie = null
  console.log(req.body.movie._id)
  console.log(movieObj)

  if(id !== 'undefined') {
    Movie.findById(id, function(err, movie){
      if (err) console.log(err)
      console.log('www',movie)
      _movie = underscore.extend(movie, movieObj)
      _movie.save(function(err, movie){ //?
        if (err) console.log(err)
        console.log('movie===',movie)
        // 重定向到对应的详情页面
        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    // 数据库中没有ID,调用构造函数,传入电影数据到数据库
    _movie = new Movie({
      imgsrc: movieObj.imgsrc,
      poster: movieObj.poster,
      title: movieObj.title,
      author: movieObj.author,
      total: movieObj.total,
      score: movieObj.score,
      country: movieObj.country,
      summary: movieObj.summary
    })

    _movie.save(function(err, movie){
      if (err) console.log(err)

      // 重定向到对应的详情页面
      res.redirect('/movie/' + movie._id)
    })
  }

})


/* Get list page. */
router.get('/list', function(req, res, next){
  Movie.fetch(function(err, movies){
    if (err) console.log(err)

    res.render('./pages/list', {
      title: 'List 信息列表',
      movies: movies
    })
  })

})

// delete
router.delete('/admin/list', function(req, res){
  var id = req.query.id
  if (id) {
    Movie.remove({_id: id}, function(err, movie){
      if (err) console.log(err)
      res.json({
        success: 1
      })
    })
  }
})

// 启动mongodb 
// 1.cmd到bin目录下执行
//    mongod --dbpath D:\MongoDB\data
// 2.新开cmd窗口到bin目录下执行
//    mongo
module.exports = router