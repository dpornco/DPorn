let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET a feed page. */
router.get('/:feed/:tag?', (req, res, next) => {
    let feed = req.params.feed
    let tag = req.params.tag
    let videodb = require('../modules/videodb');

    if(tag) {
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
      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: tag + ' videos on DPorn - Decentralized, blockchain porn'
      });
      
      }
    });
  };

  if(!tag){
    tag = ' '
    videodb.Video.find({}, function (err, result) {
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

    // res.render('feed', {
    //   feed: feed,
    //   tag: tag || ''
    // });
});

module.exports = router;