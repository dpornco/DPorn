let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET a feed page. */
router.get('/:feed/:tag?', (req, res, next) => {
    let feed = req.params.feed
    let tag = req.params.tag
    let videodb = require('../modules/videodb');

    if(tag && feed === "trending") {
    videodb.Video.find({$text: {$search: tag}}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
      function trendingSort(a, b) {
        return b.trendingRank - a.trendingRank;
      }
      let results = result.sort(trendingSort);

      let posts = JSON.stringify(results)
      //console.log(posts)


      function convertCase(str) {
        var lower = String(str).toLowerCase();
        return lower.replace(/(^| )(\w)/g, function(x) {
          return x.toUpperCase();
        });
      }
      let formattedFeed = convertCase(feed)
      let formattedTag = convertCase(tag)

      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: tag + ' videos on DPorn - Decentralized, blockchain porn'
      });
      
      }
    });
  };

  if(!tag && feed === "trending"){
    tag = ' '
    videodb.Video.find({posteddate: {$gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
      function trendingSort(a, b) {
        return b.trendingRank - a.trendingRank;
      }
      let results = result.sort(trendingSort);

      let posts = JSON.stringify(results)
      //console.log(posts)
      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: 'Trending videos on DPorn - Decentralized, blockchain porn'
      });
      
      }
    });
  };

  if(tag && feed != "trending") {
    videodb.Video.find({$text: {$search: tag}}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        function createdSort(a, b) {
          return b.posteddate - a.posteddate;
        }
        let results = result.sort(createdSort);

      let posts = JSON.stringify(results)
      function convertCase(str) {
        var lower = String(str).toLowerCase();
        return lower.replace(/(^| )(\w)/g, function(x) {
          return x.toUpperCase();
        });
      }
      let formattedFeed = convertCase(feed)
      let formattedTag = convertCase(tag)

      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: tag + ' videos on DPorn - Decentralized, blockchain porn'
      });
      
      }
    });
  };

  if(!tag && feed != "trending"){
    tag = ' '

    videodb.Video.find({posteddate: {$gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
      function createdSort(a, b) {
        return b.posteddate - a.posteddate;
      }
      let results = result.sort(createdSort);

      let posts = JSON.stringify(results)
      //console.log(posts)
      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: 'Newest videos on DPorn - Decentralized, blockchain porn'
      });
      
      }
    });
  };

    // res.render('feed', {
    //   feed: feed,
    //   tag: tag || ''
    // });
});

module.exports = router;