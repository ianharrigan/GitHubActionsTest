const core = require('@actions/core');
const github = require('@actions/github');
const http = require('http');
const fs = require('fs');

try {
    var haxeVersion = core.getInput('haxe-version');
    var platform = core.getInput('platform');

    var filename = "haxe-4.0.3-linux64.tar.gz";
    var archiveUrl = "https://github.com/HaxeFoundation/haxe/releases/download/4.0.3/" + filename;
    console.log("downloading haxe from: " + archiveUrl);

    const file = fs.createWriteStream(filename);
    const request = http.get(archiveUrl, function(response) {
        console.log("Download complete");
        response.pipe(file);
    });
} catch (error) {
    core.setFailed(error.message);
}