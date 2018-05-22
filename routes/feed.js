let express = require('express');
let util = require('../modules/util');
let router = express.Router();

/* GET a feed page. */
router.get('/:feed/:tag?', (req, res, next) => {
    let feed = req.params.feed
    let tag = req.params.tag
    let videodb = require('../modules/videodb');

    //add sortBy based on req.params.feed (trending, created, hot)

    videodb.Video.find({$text: {$search: tag}}, function (err, result) {
      if (err) {
        console.log(err)
      } else {
      let posts = JSON.stringify(result)
      //console.log(result)
      res.render('feed', {
        feed: feed,
        tag: tag || '',
        posts: posts,
        title: tag + ' videos on DPorn - Decentralized, blockchain driven porn'
      });
      
      }
    });



    // res.render('feed', {
    //   feed: feed,
    //   tag: tag || ''
    // });
});

module.exports = router;