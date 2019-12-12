const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const child_process = require('child_process');

try {
    var haxeVersion = core.getInput('haxe-version');
    var platform = core.getInput('platform');

    console.log("haxeVersion: " + haxeVersion);
    console.log("platform: " + platform);

    child_process.execSync('sudo add-apt-repository ppa:haxe/snapshots -y', {stdio: 'inherit'});
    child_process.execSync('sudo apt-get update', {stdio: 'inherit'});
    child_process.execSync('sudo apt install neko -y', {stdio: 'inherit'});

    var filename = "haxe-" + haxeVersion + "-" + platform + ".tar.gz";
    var archiveUrl = "http://github.com/HaxeFoundation/haxe/releases/download/" + haxeVersion + "/" + filename;
    console.log("Downloading haxe from: " + archiveUrl);

    child_process.execSync('wget ' + archiveUrl, {stdio: 'inherit'});
    fs.mkdirSync("/opt/haxe");
    child_process.execSync('tar -C /opt/haxe -zxvf ' + filename + ' --strip 1', {stdio: 'inherit'});
    child_process.execSync("chmod 777 /opt/haxe/haxe", {stdio: 'inherit'});
    child_process.execSync("chmod 777 /opt/haxe/haxelib", {stdio: 'inherit'});
    fs.mkdirSync("/opt/haxelib");
    child_process.execSync("/opt/haxe/haxelib setup /opt/haxelib", {stdio: 'inherit'});

    child_process.execSync("echo ::add-path::/opt/haxe", {stdio: 'inherit'});
    child_process.execSync("echo ::set-env name=HAXE_STD_PATH::/opt/haxe/std", {stdio: 'inherit'});
} catch (error) {
    core.setFailed(error.message);
}