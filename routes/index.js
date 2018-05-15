let express = require('express');
let router = express.Router();
let util = require('../modules/util')

/* GET home page. */
router.get('/', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect(`/feed/trending`)
  } else {
    res.redirect(`/feed/trending`)
    //res.render('index', { title: 'DPorn - blockchain porn' });
  }
});

/* GET a users blog profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
    res.redirect(`/feed/trending`)
      /*res.render('profile', {
        username: username
      });*/
});

/* GET a users blog feed page. */
router.get('/@:username/feed', (req, res, next) => {
      let username = req.params.username
      res.redirect(`/feed/trending`)
      /*res.render('feed', {
        feed: 'user-feed',
        username: username
      });*/
});

/* GET a users transfers profile page. */
router.get('/@:username/transfers', (req, res, next) => {
      let username = req.params.username
      res.render('transfers', {
        username: username,
        user: req.session.steemconnect ? req.session.steemconnect.name : ''
      });
});

/* GET a single post page page. */
router.get('/:category/@:username/:permlink', (req, res, next) => {
      let category = req.params.category
      let username = req.params.username
      let permlink = req.params.permlink
      let videohashstr = "no video found"
      let activeuser = "dpornco"

      /*If user is signed in, get their username to check for vote status on post*/
      if (typeof req.session.steemconnect !== 'undefined') {
        activeuser = req.session.steemconnect.name;
        //console.log(activeuser)
      }


  function getVidBeforeRender(category,username,permlink,activeuser){
        let videodb = require('../modules/videodb');
        let videohashstr = "no video found"
        let videohashstrraw = "raw string"

        videodb.Video.findOne ({ 'permlink': [req.params.permlink] }, 'originalHash', function(err, dpost) {
          if (err) return next(err);
          if (!dpost) return res.render('single', {
            category: category,
            username: username,
            permlink: permlink,
            videohashstr: videohashstr,
            activeuser: activeuser
          });
          return videohashstr = JSON.stringify(dpost.originalHash),
          videohashstr = videohashstr.slice(1, -1),
          console.log(activuser),
          res.render('single', {
            category: category,
            username: username,
            permlink: permlink,
            videohashstr: videohashstr,
            activeuser: activeuser
          });
        
        });

  };

getVidBeforeRender(category,username,permlink,activeuser);

});
module.exports = router;
