const core = require('@actions/core');
const github = require('@actions/github');
const http = require('http');
const fs = require('fs');
const child_process = require('child_process');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };

try {
    var haxeVersion = core.getInput('haxe-version');
    var platform = core.getInput('platform');

    var filename = "haxe-4.0.3-linux64.tar.gz";
    var archiveUrl = "http://github.com/HaxeFoundation/haxe/releases/download/4.0.3/" + filename;
    console.log("Downloading haxe from: " + archiveUrl);

    download(archiveUrl, filename, function() {
        console.log("Download complete");
        console.log("Expanding " + filename);
        fs.mkdirSync("/opt/haxe");
        //child_process.execSync("tar -C /opt/haxe -zxvf " + filename + " --strip 1");
        child_process.execSync("tar" ["-C", "/opt/haxe", "-zxvf", filename, "--strip", "1"]);
        child_process.execSync("chmod 777 /opt/haxe/haxe");
        child_process.execSync("chmod 777 /opt/haxe/haxelib");
        fs.mkdirSync("/opt/haxelib");
        child_process.execSync("/opt/haxe/haxelib setup /opt/haxelib");
    })

    /*
    const file = fs.createWriteStream(filename);
    const request = http.get(archiveUrl, function(response) {
        console.log("Download complete");
        response.pipe(file);
        console.log("Expanding " + filename);
        fs.mkdirSync("/opt/haxe");
        child_process.execSync("tar -C /opt/haxe -zxvf " + filename + " --strip 1");
        child_process.execSync("chmod 777 /opt/haxe/haxe");
        child_process.execSync("chmod 777 /opt/haxe/haxelib");
        fs.mkdirSync("/opt/haxelib");
        child_process.execSync("/opt/haxe/haxelib setup /opt/haxelib");
    });
    */
} catch (error) {
    core.setFailed(error.message);
}