let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

/* GET authenticate a user/redirect to steemconnect. */
router.get('/', (req, res, next) => {
    if (!req.query.access_token ) {
        let returnTo = req.headers['referer'];
        req.session.returnTo = returnTo
        console.log(returnTo);
        let uri = steem.getLoginURL();
        res.redirect(uri);        
        } else {
        steem.setAccessToken(req.query.access_token);
        steem.me((err, steemResponse) => {
          req.session.steemconnect = steemResponse.account;
          req.session.access_token = req.query.access_token;
          res.redirect(req.session.returnTo);
          //res.redirect(`/@${req.session.steemconnect.name}`)
        });
    }
});

/* GET authenticate a user/redirect to steemconnect. */
router.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect(req.headers['referer'])
});

module.exports = router;
