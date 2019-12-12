const core = require('@actions/core');
const github = require('@actions/github');
const http = require('http');
const fs = require('fs');
const child_process = require('child_process');

try {
    var haxeVersion = core.getInput('haxe-version');
    var platform = core.getInput('platform');

    var filename = "haxe-4.0.3-linux64.tar.gz";
    var archiveUrl = "http://github.com/HaxeFoundation/haxe/releases/download/4.0.3/" + filename;
    console.log("Downloading haxe from: " + archiveUrl);

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
} catch (error) {
    core.setFailed(error.message);
}