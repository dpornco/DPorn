var express = require('express');
var app = express();
let router = express.Router();
var fs = require("fs")
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var livePosts = []

function loadLivePost()
{
    livePosts = JSON.parse(fs.readFileSync("livePosts.json"))
}

function deleteFromLivePost(post)
{
    loadLivePost()
    var toDelete = post
    var index = livePosts.indexOf(toDelete)
    if (index > -1) {
        livePosts.splice(index, 1);
    }
    fs.writeFile("livePosts.json",  JSON.stringify(livePosts, null, 2) , function(err) {})
    
}

router.get('/', function(req, res) {
    loadLivePost()
    res.json(livePosts);   
});

router.delete('/', function(req, res) {
    if (req.body.key == "princess556")
    {
        loadLivePost()
        if (req.body.toDelete != null)
        {
            if (livePosts.includes(req.body.toDelete))
            {
                deleteFromLivePost(req.body.toDelete)
                res.json({"message": "Sucessfully deleted"})
            }
            else
            {
                res.json({"message": "That wasn't in the file."})
            }
        }
        
    }
    else
    {
        res.json({"message": 'Please use a correct key' });   
    }
});




module.exports = router;
