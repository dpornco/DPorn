let express = require('express');
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let router = express.Router();
let ipfsAPI = require('ipfs-api');
let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.post('/', function(req, res){
  console.log("FOXON")

  // create an incoming form object
  let form = new formidable.IncomingForm();

  form.maxFileSize = 2.1 * 1024 * 1024 * 1024

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../public/vidcache');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name))
    let uploadedFileAndLocation = fs.createReadStream(path.join(form.uploadDir, file.name))
    let fileToAddToIpfs = {content: uploadedFileAndLocation}
    ipfs.files.add(fileToAddToIpfs, function (err, files) {
      console.log(files[0].hash)
      res.send(files[0].hash)
      fs.rename(form.uploadDir+"/"+file.name, form.uploadDir+"/"+files[0].hash, (function (err) {
        if (err) throw err;
        console.log('File Renamed.');
       }))
     })

  });

  // log any errors that occur
  form.on('error', function(err) {
    res.end('An error has occured: \n' + err);
  });
/*
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.send('success');
  });
*/
  // parse the incoming request containing the form data
  form.parse(req);

});

module.exports = router;
