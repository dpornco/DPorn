//Connect to mongo using mongoose
let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/dpdb'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let VideoSchema = new mongoose.Schema({
  title: String,
  permlink: String,
  content: String,
  tags: String,
  originalHash: String,
  sixfortyHash: String,
  posterHash: String,
  videoWidth: Number,
  videoSize: Number,
  videoDuration: Number,
  username: String,
  powerup: Number,
  status: String,
  posteddate: Date,
  noofview: Number,
  upvote: Number,
  downvote: Number,
  netvote: Number,
  value: Number,
  subscribers: Array,
}, {
toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

VideoSchema.virtual('trendingRank').get(function() {
  if(!this.posteddate) {this.posteddate = Date.now()}
  return this.value/((Date.now() - this.posteddate.getTime())/(1000*60*60));
});

//add field for upvotes, update whenever video is loaded, use for trending

VideoSchema.index({name: 'text', 'tags': 'text'});

exports.Video = mongoose.model('Video', VideoSchema);

/*exports.getVidHashFromPermLink = function(permlink) {
  var query = Video.findOne ({ 'permlink': [permlink] }, 'originalHash');
  return query;
}*/
