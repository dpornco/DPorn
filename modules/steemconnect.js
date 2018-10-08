let steemconnect2 = require('steemconnect');
let config = require('../config')

let steem = steemconnect2.Initialize({
    app: config.auth.client_id,
    callbackURL: config.auth.redirect_uri ,
    scope: ['login','vote', 'comment', 'comment_options']
});

module.exports = steem;
