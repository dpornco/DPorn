let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let expressSanitized = require('express-sanitize-escape');

let index = require('./routes/index');
let auth = require('./routes/auth');
let feed = require('./routes/feed');
let post = require('./routes/post');
//let view = require('./routes/view');
let uploads = require('./routes/uploads');
//let tag = require('./routes/tag');

let config = require('./config')

let util = require('./modules/util')

let app = express();

app.use(session({
    secret: config.session.secret,
    saveUninitialized: true,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized.middleware());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// custom middleware
app.use(util.setUser);


app.use('/', index);
app.use('/auth', auth);
app.use('/logout', auth);
app.use('/feed', feed);
app.use('/post', post);
app.use('/post/create-post', post);
// app.use('/view', view);
app.use('/upload', uploads);
//app.use('/tag', tag);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
  //console.log(req);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect('/');
});

var cron = require('node-cron');
 
cron.schedule('*/2 * * * *', function(){
  console.log("starting db cache update from blockchain")
  let videodb = require('./modules/videodb');
  videodb.Video.find({$or: [{posteddate: null}, {posteddate: {$gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))}}]}, function (err, result) {
    if (err) {
      console.log(err)
    }
    //console.log(result)
    for (let i = 0; i < result.length; i++) {
        let steem = require('steem');
        let entry = result[i]
        let username = entry.username
        let permlink = entry.permlink 
        //console.log(username, " ", permlink)       
        steem.api.getContent(username, permlink, function(err, result) {
          if (err) {
            console.log(err, "post not found")
          } else {
            if (result.json_metadata) {
              //add pending and total payouts for db "value"
              let pendingValue = result.pending_payout_value.slice(0, -4)
              let paidValue = result.total_payout_value.slice(0, -4)
              let postValue = Number(pendingValue) + Number(paidValue)

              entry.set({value: postValue,
                posteddate: result.created,
                tags: JSON.parse(result.json_metadata).tags.join(','),              
                netvote: result.net_votes})
              entry.save(function (err, vid) {
                if (err) console.log(err)
              });
            } else {
              console.log("post not found", entry.permlink)
              
            }
          }
        });
      };
    });

  console.log("cache update completed");
});

module.exports = app;
