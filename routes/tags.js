let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) =>  {
    console.log("got to the tags route")
    let videodb = require('../modules/videodb')
    console.log("the videodb variable was set")
    videodb.Video.aggregate([
      { $project: { tags: { $split:["$tags",","] }}},
      { $unwind: "$tags"},
      { $group: { _id: {"tags" : "$tags"}, count:{ $sum:1 } } }
    ], function (err, result) {
        console.log("this is inside the query stuff")
        if (err) {
            console.log(err)
        } else {
            (console.log(JSON.stringify(result)))
        res.render('tags', {            
            tags: JSON.stringify(result)
          });
        }
    })
});

module.exports = router;