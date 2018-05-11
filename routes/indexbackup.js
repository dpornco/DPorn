let express = require('express');
let router = express.Router();
let util = require('../modules/util')

/* GET home page. */
router.get('/', (req, res, next) =>  {
  if(req.session.steemconnect){
    res.redirect(`/@${req.session.steemconnect.name}`)
  } else {
    res.render('index', { title: 'DPorn - blockchain porn' });
  }
});

/* GET a users blog profile page. */
router.get('/@:username', (req, res, next) => {
      let username = req.params.username
      res.render('profile', {
        username: username
      });
});

/* GET a users blog feed page. */
router.get('/@:username/feed', (req, res, next) => {
      let username = req.params.username
      res.render('feed', {
        feed: 'user-feed',
        username: username
      });
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
      let videodb = require('../modules/videodb');
     
      /*videohashfromdb = videodb.Video.findOne ({ 'permlink': [req.params.permlink] }, 'originalHash', function(err, dpost) {
        if (err) return next(err);
        if (!dpost) return "no video";
        return (dpost.originalHash),
        console.log(dpost.originalHash)
        
      });*/


//console.log(videohashfromdb);

let query = videodb.getVidHashFromPermLink(permlink);
query.exec(function(err,vidhash){
  if(err)
    return console.log(err);
  return videohashstr = vidhash,
    console.log(vidhash)
});

//console.log(vidresults);

      //videohashstr = "QmYptJQzTSokMSPxn2ZHSr2qTVtmrV28N2QgyyKvTCUReb";

      res.render('single', {
        category: category,
        username: username,
        permlink: permlink,
        videohashstr: videohashstr
      });

});

module.exports = router;
