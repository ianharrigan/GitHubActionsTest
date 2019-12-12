const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const child_process = require('child_process');

try {
    var haxeVersion = core.getInput('haxe-version');
    var platform = core.getInput('platform');

    var installLocation = "/usr/local/bin/haxe";
    var haxelibLocation = "/usr/local/bin/haxe/haxelibs";

    console.log("haxeVersion: " + haxeVersion);
    console.log("platform: " + platform);

    if (platform == "linux64") {
        child_process.execSync('sudo add-apt-repository ppa:haxe/snapshots -y', {stdio: 'inherit'});
        child_process.execSync('sudo apt-get update', {stdio: 'inherit'});
        child_process.execSync('sudo apt install neko -y', {stdio: 'inherit'});

        installLocation = "/opt/haxe";
        haxelibLocation = "/opt/haxe/haxelibs";
    } else if (platform == "osx") {
        child_process.execSync('brew install neko --HEAD', {stdio: 'inherit'});
    } else if (platform == "win64") {
        installLocation = "C:\\haxe";
        haxelibLocation = "C:\\haxe\\haxelibs";
    }

    var filename = "haxe-" + haxeVersion + "-" + platform + ".tar.gz";
    var archiveUrl = "http://github.com/HaxeFoundation/haxe/releases/download/" + haxeVersion + "/" + filename;

    if (platform == "linux64" || platform == "osx") {
        console.log("Downloading haxe from: " + archiveUrl);

        child_process.execSync('wget ' + archiveUrl, {stdio: 'inherit'});
        fs.mkdirSync(installLocation);
        child_process.execSync('tar -C ' + installLocation + ' -zxvf ' + filename + ' --strip 1', {stdio: 'inherit'});
        child_process.execSync("chmod 777 " + installLocation + "/haxe", {stdio: 'inherit'});
        child_process.execSync("chmod 777 " + installLocation + "/haxelib", {stdio: 'inherit'});
        fs.mkdirSync(haxelibLocation);
        child_process.execSync(installLocation + "/haxelib setup " + haxelibLocation, {stdio: 'inherit'});
    } else if (platform == "win64") {
        child_process.execSync('powershell "' + __dirname + '/download-file-windows.ps1" -url "' + archiveUrl + '" -output "' + filename + '"', {stdio: 'inherit'});
    }

    child_process.execSync("echo ::add-path::" + installLocation, {stdio: 'inherit'});
    child_process.execSync("echo ::set-env name=HAXE_STD_PATH::" + installLocation + "/std", {stdio: 'inherit'});
} catch (error) {
    core.setFailed(error.message);
}