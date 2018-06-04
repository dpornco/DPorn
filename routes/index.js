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

// /* GET a users blog profile page. */
// router.get('/@:username', (req, res, next) => {
  
//     res.redirect(`/feed/trending`)
//       //res.render('profile', {
//       //  username: username
//       //});
// });

/* GET a users blog feed page. */
router.get('/@:username', (req, res, next) => {
  let videodb = require('../modules/videodb');
  console.log(req.username);
  videodb.Video.find({'username': [req.params.username]}, function (err, result) {
    if (err) {
      res.redirect(`/feed/trending`)
      console.log(err)
    } else {
    console.log(result);
    function createdSort(a, b) {
      return b.posteddate - a.posteddate;
    }
    let results = result.sort(createdSort);

    let posts = JSON.stringify(results)
    //console.log(posts)
    res.render('feed', {
      feed: 'user-feed',
      posts: posts,
      username: req.username,
      title: 'Newest videos from' + req.username + 'DPorn - Decentralized, blockchain porn'
    });
    
    }
  });
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

      /*If user is signed in, get their username to check for vote status on post later*/
      if (typeof req.session.steemconnect !== 'undefined') {
        activeuser = req.session.steemconnect.name;
      }


  function getVidBeforeRender(category,username,permlink,activeuser){
        let videodb = require('../modules/videodb');
        let videohashstr = "no video found"

        videodb.Video.findOne ({ 'permlink': [req.params.permlink] }, 'originalHash', function(err, dpost) {
          if (err) return next(err);
          if (!dpost) return res.render('single', {
            category: category,
            username: username,
            permlink: permlink,
            videohashstr: videohashstr,
            activeuser: activeuser
          });

          let steem = require('steem');
          steem.api.getContent(username, permlink, function(err, result) {
            console.log(result.created)
            if (err) {
              console.log(err)
            } else {
              dpost.set({value: result.total_payout_value.slice(0, -4),
                netvote: result.net_votes,
                tags: JSON.parse(result.json_metadata).tags.join(','),
                posteddate: result.created})
              dpost.save(function (err, vid) {
                if (err) console.log(err)
              });
            }
          });


          return videohashstr = JSON.stringify(dpost.originalHash),
          videohashstr = videohashstr.slice(1, -1),
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

  //steem.api.getContent(username, permlink, function(err, result) {
//     let steem = require('steem');
//     steem.api.getContent(username, permlink, function(err, result) {
//       // console.log(err, result);
//       // console.log(result.net_votes);
//       // console.log(result.created);
//       // console.log(result.total_payout_value);
//       //console.log(result.json_metadata)
//       console.log(JSON.parse(result.json_metadata).tags.join(','))
//         let videodb = require('../modules/videodb');
//         videodb.Video.findOne ({ 'permlink': [req.params.permlink] }, function(err, dpost) {
//           console.log(err, dpost.tags)
//         });
      
//     });

});

module.exports = router;
