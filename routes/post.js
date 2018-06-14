let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let router = express.Router();


/* GET a create post page. */
router.get('/', util.isAuthenticated, (req, res, next) => {
    res.render('post', {
      name: req.session.steemconnect.name
    });
});

/* POST a create post broadcast to STEEM network. */
router.post('/create-post', util.isAuthenticated, (req, res) => {
    let author = req.session.steemconnect.name
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = tags[0] || ''
    let otherTags = tags.slice(1)
    let title = req.body.title
    //let permlink = util.urlString()
    let permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase() + "dporn";
    let originalHash = req.body.videohash
    console.log(tags)
    console.log(JSON.stringify(tags))
    let posterHash = req.body.thumbnailhash
    let body = '<center><a href="https://alpha003.dporn.co/dporn/@'+author+"/"+permlink+'"><img src="https://steemitimages.com/0x0/http://gateway.ipfs.io/ipfs/'+posterHash+'"><h1>View video on DPorn</h1></a></center>'
    let customData = {
      tags: tags,
      app: 'dporn.app/v0.0.3',
      originalHash: originalHash,
      posterHash: posterHash
    }

    //add to mongo
    let videodb = require('../modules/videodb');
    let mongoEntry = new videodb.Video({
      title: title,
      permlink: permlink,
      content: body,
      tags: JSON.stringify(tags),
      originalHash: originalHash,
      posterHash: posterHash,
      username: author,
      status: 'draft',
      posteddate: Date.now()
    });
    console.log(mongoEntry)
    mongoEntry.save(function (err) {
      if (err) return handleError(err);
        // saved!
      });

      //steem.comment('', primaryTag, author, permlink, title, body, customData, (err, steemResponse) => {
      steem.setAccessToken(req.session.access_token);
      steem.comment('', 'dporn', author, permlink, title, body, customData, (err, steemResponse) => {
        if (err) {
          console.log(err)
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Error - ' + err
          })
        } else {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Posted To Steem Network'
          })
        }
    });

});

/* POST a vote broadcast to STEEM network. */
router.post('/vote', util.isAuthenticatedJSON, (req, res) => {

  
    //steem.setAccessToken(req.query.access_token);
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = req.body.weight*100
    steem.setAccessToken(req.session.access_token);
    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
      if (err) {
          res.json({ error: err.error_description })
      } else {
          res.json({ id: postId })
      }
    });
})

/* POST a comment broadcast to STEEM network. */
router.post('/comment',  util.isAuthenticatedJSON, (req, res) => {
    let author = req.session.steemconnect.name
    let permlink = req.body.parentPermlink + '-' + util.urlString()
    let title = 'RE: ' + req.body.parentTitle
    let body = req.body.message
    let parentAuthor = req.body.parentAuthor
    let parentPermlink = req.body.parentPermlink
    steem.setAccessToken(req.session.access_token);

    //steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, '', (err, steemResponse) => {
      let ben = [{'account': "dporn", 'weight': 100},{'account': "dpornco", 'weight': 100}]
      steem.broadcast([['comment', {'parent_author': '', 'parent_permlink': 'dporn', 'author': author, 'permlink': permlink, 'title': title, 'body': body, 'json_metadata': JSON.stringify({app: 'dporn.app/v0.0.3', tags: tags, image: ['"https://steemitimages.com/0x0/https://gateway.ipfs.io/ipfs/' + posterHash + '"']})}], ['comment_options', {'author': author, 'permlink': permlink, 'max_accepted_payout': '1000000.000 SBD', 'percent_steem_dollars': 10000, 'allow_votes': true, 'allow_curation_rewards': true, 'extensions': [[0, {'beneficiaries': ben}]]}]], function (err, response) {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          res: steemResponse
        })
      }
    });
});

module.exports = router;
